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
  TranscribeConversationDto,
} from './dto/conversation.dto';
import { Conversation } from './entities/conversation.entity';
import { UserService } from 'src/user/user.service';
import OpenAI from 'openai';
import * as fs from 'fs';

@Injectable()
export class ConversationService {
  @Inject(UserService) private readonly userService: UserService;
  private readonly conversations: Conversation[] = [];
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: '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',
    });
  }

  create(createConversationDto: CreateConversationDto): Conversation {
    const timestamp = Date.now();
    const owner = this.userService.findOne(createConversationDto.userId);
    const maxMembers = createConversationDto.maxMembers;
    const newConversation: Conversation = {
      uuid: crypto.randomUUID(),
      owner,
      members: [],
      maxMembers,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.conversations.push(newConversation);
    return newConversation;
  }

  join(uuid: string, joinConversationDto: JoinConversationDto): Conversation {
    const conversation = this.conversations.find((conv) => conv.uuid === uuid);
    if (!conversation) {
      throw new NotFoundException(`Conversation with uuid ${uuid} not found`);
    }
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
    const conversation = this.conversations.find((conv) => conv.uuid === uuid);
    if (!conversation) {
      throw new NotFoundException(`Conversation with uuid ${uuid} not found`);
    }
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

  audio(uuid: string, audioConversationDto: AudioConversationDto): Conversation {
    const conversation = this.conversations.find((conv) => conv.uuid === uuid);
    if (!conversation) {
      throw new NotFoundException(`Conversation with uuid ${uuid} not found`);
    }
    const user = this.userService.findOne(audioConversationDto.userId);
    const participant = conversation.members.find((member) => member.uuid === user.uuid);
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
    conversation.updatedAt = Date.now();
    conversation.audioFile = audioConversationDto.file;
    return conversation;
  }

  async transcribe(uuid: string, audioConversationDto: TranscribeConversationDto): Promise<{ transcription: string }> {
    const conversation = this.conversations.find((conv) => conv.uuid === uuid);
    if (!conversation) {
      throw new NotFoundException(`Conversation with uuid ${uuid} not found`);
    }
    const user = this.userService.findOne(audioConversationDto.userId);
    const participant = conversation.members.find((member) => member.uuid === user.uuid);
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

    const response = await this.openai.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-1',
      language: 'fr',
      prompt: 'Transcribe this audio file in french',
    });

    return { transcription: response.text };
  }

  findOne(uuid: string): Conversation {
    const conversation = this.conversations.find((conv) => conv.uuid === uuid);
    if (!conversation) {
      throw new NotFoundException(`Conversation with uuid ${uuid} not found`);
    }
    return conversation;
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
