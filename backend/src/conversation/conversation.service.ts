import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AudioConversationDto,
  CreateConversationDto,
  JoinConversationDto,
  LeaveConversationDto,
  TranscriptConversationDto,
} from './dto/conversation.dto';
import { Conversation } from './entities/conversation.entity';
import { UserService } from 'src/user/user.service';
import OpenAI from 'openai';
import * as fs from 'fs';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ConversationService {
  @Inject(UserService) private readonly userService: UserService;
  private readonly conversations: Conversation[] = [];
  private readonly openai: OpenAI;
  private readonly openaiKey: string = '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';
  private readonly openaiPrompt: string = `
    Tu es un assistant chargé d’extraire des informations d’un entretien entre deux personnes à partir d’une transcription.
    Objectif : produire un JSON structuré contenant uniquement les informations réellement présentes dans la transcription. Si une information est absente ou non précisée, laisse le champ correspondant vide ("" ou [] selon le type).
    Voici le format de sortie JSON attendu :
    {
      "Identité": {
        "Nom": "",
        "Prénom": "",
        "Âge": ""
      },
      "Contact": {
        "Téléphone": "",
        "Email": ""
      },
      "Expérience": {
        "Postes_occupés": [],
        "Durées": []
      },
      "Compétences": {
        "Techniques": [],
        "Soft_skills": []
      },
      "Disponibilité": {
        "Dates": "",
        "Contraintes": ""
      },
      "Prétentions": {
        "Salaire": "",
        "Conditions": ""
      },
      "Motivation": {
        "Éléments_clés": ""
      }
    }
    Règles à respecter :
    - Ne jamais inventer de données.
    - Si un champ n’est pas mentionné ou reste flou dans la conversation, laisse-le vide.
    - Ne pas inclure d’analyse, seulement les données factuelles extraites.
    - Ne pas inclure de nom de champ ou de texte supplémentaire en dehors du JSON ci-dessus.
  `;

  constructor() {
    this.openai = new OpenAI({
      apiKey: this.openaiKey,
    });
  }

  create(createConversationDto: CreateConversationDto): Conversation {
    const timestamp = Date.now();
    const owner = this.userService.findOne(createConversationDto.userId);
    const newConversation: Conversation = {
      uuid: crypto.randomUUID(),
      owner,
      members: [],
      maxMembers: 2,
      audioFile: null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.conversations.push(newConversation);
    return newConversation;
  }

  join(uuid: string, joinConversationDto: JoinConversationDto): Conversation {
    const conversation = this.findOne(uuid);
    if (conversation.members.length >= conversation.maxMembers) {
      throw new ConflictException(
        `Conversation has reached maximum capacity of ${conversation.maxMembers} members`,
      );
    }
    const user = this.userService.findOne(joinConversationDto.userId);
    if (
      conversation.members.some((participant) => participant.uuid === user.uuid)
    ) {
      throw new ConflictException(
        `User with uuid ${user.uuid} is already a participant in this conversation`,
      );
    }
    conversation.updatedAt = Date.now();
    conversation.members.push({
      ...user,
      isOwner: conversation.owner.uuid === user.uuid,
    });
    return conversation;
  }

  leave(
    uuid: string,
    leaveConversationDto: LeaveConversationDto,
  ): Conversation {
    const conversation = this.findOne(uuid);
    const user = this.userService.findOne(leaveConversationDto.userId);
    const participantIndex = conversation.members.findIndex(
      (participant) => participant.uuid === user.uuid,
    );
    if (participantIndex === -1) {
      throw new NotFoundException(
        `User with uuid ${user.uuid} is not a participant in this conversation`,
      );
    }
    conversation.updatedAt = Date.now();
    conversation.members.splice(participantIndex, 1);
    return conversation;
  }

  audio(
    uuid: string,
    audioConversationDto: AudioConversationDto,
  ): Conversation {
    const conversation = this.findOne(uuid);
    const user = this.findMember(uuid, audioConversationDto.userId);
    if (!user.isOwner) {
      throw new ForbiddenException(
        `User with uuid ${user.uuid} is not the owner of this conversation`,
      );
    }
    conversation.updatedAt = Date.now();
    conversation.audioFile = audioConversationDto.file;
    return conversation;
  }

  async transcript(
    uuid: string,
    audioConversationDto: TranscriptConversationDto,
  ): Promise<Conversation> {
    const conversation = this.findOne(uuid);
    const user = this.userService.findOne(audioConversationDto.userId);
    const participant = conversation.members.find(
      (member) => member.uuid === user.uuid,
    );
    if (!participant) {
      throw new NotFoundException(
        `User with uuid ${user.uuid} is not a participant in this conversation`,
      );
    }
    if (!participant.isOwner) {
      throw new ForbiddenException(
        `User with uuid ${user.uuid} is not the owner of this conversation`,
      );
    }
    if (!conversation.audioFile) {
      throw new NotFoundException(
        `No audio file found in conversation with uuid ${uuid}`,
      );
    }

    let fileStream = fs.createReadStream(conversation.audioFile.path);
    fileStream = Object.assign(fileStream, {
      name: conversation.audioFile.originalname,
      type: conversation.audioFile.mimetype,
    });

    console.log("ICI tete de cul !");
    

    const response = await this.openai.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-1',
      language: 'fr',
      prompt: this.openaiPrompt,
    });

    conversation.transcript = {
      text: response.text,
      duration: (response.usage as any).seconds ?? 0,
    }
    return conversation;
  }

  async formatTranscription(
    uuid: string,
    audioConversationDto: TranscriptConversationDto,
  ): Promise<Conversation> {
    const conversation = this.findOne(uuid);
    const user = this.userService.findOne(audioConversationDto.userId);
    const participant = conversation.members.find(
      (member) => member.uuid === user.uuid,
    );
    if (!participant) {
      throw new NotFoundException(
        `User with uuid ${user.uuid} is not a participant in this conversation`,
      );
    }
    if (!participant.isOwner) {
      throw new ForbiddenException(
        `User with uuid ${user.uuid} is not the owner of this conversation`,
      );
    }
    if (!conversation.audioFile) {
      throw new NotFoundException(
        `No audio file found in conversation with uuid ${uuid}`,
      );
    }

    console.log("ICI aussi tete de cul !");

    let fileStream = fs.createReadStream(conversation.audioFile.path);
    fileStream = Object.assign(fileStream, {
      name: conversation.audioFile.originalname,
      type: conversation.audioFile.mimetype,
    });

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: this.openaiPrompt
        },
        {
          role: 'user',
          content: `Voici la transcription à analyser : ${conversation.transcript?.text}`,
        }
      ],
    });

    conversation.formattedTranscript = JSON.parse(response.choices[0].message.content ?? '{}');
    return conversation;
  }

  findOne(uuid: string): Conversation {
    const conversation = this.conversations.find((conv) => conv.uuid === uuid);
    if (!conversation) {
      throw new NotFoundException(`Conversation with uuid ${uuid} not found`);
    }
    return conversation;
  }

  findAll(): Conversation[] {
    return this.conversations;
  }

  findMember(uuid: string, userUuid: string): User & { isOwner: boolean } {
    const conversation = this.findOne(uuid);
    const member = conversation.members.find(
      (participant) => participant.uuid === userUuid,
    );
    if (!member) {
      throw new NotFoundException(
        `User with uuid ${userUuid} is not a participant in conversation with uuid ${uuid}`,
      );
    }
    return member;
  }

  findMembers(uuid: string): (User & { isOwner: boolean })[] {
    return this.findOne(uuid).members;
  }

  remove(uuid: string): { message: string } {
    const conversationIndex = this.conversations.findIndex(
      (conv) => conv.uuid === uuid,
    );
    if (conversationIndex === -1) {
      throw new NotFoundException(`Conversation with uuid ${uuid} not found`);
    }
    this.conversations.splice(conversationIndex, 1);
    return { message: `Conversation with uuid ${uuid} has been removed` };
  }
}
