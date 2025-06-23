import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateConversationDto,
  JoinConversationDto,
  LeaveConversationDto,
} from './dto/conversation.dto';
import { Conversation } from './entities/conversation.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ConversationService {
  private readonly userService: UserService;
  private readonly conversations: Conversation[] = [];

  constructor(userService: UserService) {
    this.userService = userService;
  }

  create(createConversationDto: CreateConversationDto): Conversation {
    const user = this.userService.findOne(createConversationDto.userId);
    const newConversation: Conversation = {
      uuid: crypto.randomUUID(),
      owner: user,
      participants: [],
    };
    this.conversations.push(newConversation);
    return newConversation;
  }

  join(uuid: string, joinConversationDto: JoinConversationDto): Conversation {
    const conversation = this.conversations.find((conv) => conv.uuid === uuid);
    if (!conversation) {
      throw new NotFoundException(`Conversation with uuid ${uuid} not found`);
    }
    const user = this.userService.findOne(joinConversationDto.userId);
    if (
      conversation.participants.some(
        (participant) => participant.uuid === user.uuid,
      )
    ) {
      throw new ConflictException(
        `User with uuid ${user.uuid} is already a participant in this conversation`,
      );
    }
    conversation.participants.push(user);
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
    const participantIndex = conversation.participants.findIndex(
      (participant) => participant.uuid === user.uuid,
    );
    if (participantIndex === -1) {
      throw new NotFoundException(
        `User with uuid ${user.uuid} is not a participant in this conversation`,
      );
    }
    conversation.participants.splice(participantIndex, 1);
    return conversation;
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
