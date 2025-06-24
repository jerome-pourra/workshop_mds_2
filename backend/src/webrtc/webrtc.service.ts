import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Webrtc } from './entities/webrtc.entity';
import { Socket } from 'socket.io';
import { PayloadWebrtcDto } from './dto/webrtc.dto';
import { ConversationService } from 'src/conversation/conversation.service';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class WebrtcService {
  @Inject(UserService) private readonly userService: UserService;
  @Inject(ConversationService)
  private readonly conversationService: ConversationService;
  private readonly channels: Webrtc[] = [];

  join(client: Socket, payload: PayloadWebrtcDto): User {
    const conversation = this.conversationService.findOne(
      payload.conversationUuid,
    );
    const user = conversation.members.find(
      (member) => member.uuid === payload.userUuid,
    );
    if (!user) {
      throw new Error(
        `User with UUID ${payload.userUuid} not found in conversation ${payload.conversationUuid}`,
      );
    }
    if (
      this.channels.some(
        (channel) => channel.conversation.uuid === conversation.uuid,
      )
    ) {
      if (
        this.channels.some((channel) =>
          channel.users.some((u) => u.user.uuid === user.uuid),
        )
      ) {
        throw new Error(
          `User with UUID ${user.uuid} is already in a WebRTC channel for conversation ${conversation.uuid}`,
        );
      }
      // Add user to existing channel
      const channel = this.findOne(conversation.uuid);
      channel.users.push({
        socket: client,
        user: user,
      });
      return user;
    } else {
      // Create a new channel
      const channel = this.createChannel(client, conversation, user);
      this.channels.push(channel);
      return user;
    }
  }

  leave(payload: PayloadWebrtcDto): User {
    const channel = this.findOne(payload.conversationUuid);
    const channelUser = channel.users.find(
      (u) => u.user.uuid === payload.userUuid,
    );
    if (!channelUser) {
      throw new Error(
        `User with UUID ${payload.userUuid} not found in channel for conversation ${payload.conversationUuid}`,
      );
    }
    channel.users = channel.users.filter(
      (u) => u.user.uuid !== payload.userUuid,
    );
    return channelUser.user;
  }

  findOne(conversationUuid: string): Webrtc {
    const channel = this.channels.find(
      (channel) => channel.conversation.uuid === conversationUuid,
    );
    if (!channel) {
      throw new Error(
        `Channel with conversation UUID ${conversationUuid} not found`,
      );
    }
    return channel;
  }

  findUser(conversationUuid: string, userUuid: string): User {
    const channel = this.findOne(conversationUuid);
    const user = channel.users.find((u) => u.user.uuid === userUuid);
    if (!user) {
      throw new Error(
        `User with UUID ${userUuid} not found in channel for conversation ${conversationUuid}`,
      );
    }
    return user.user;
  }

  findUserSockets(conversationUuid: string): Socket[] {
    const channel = this.findOne(conversationUuid);
    return channel.users.map((u) => u.socket);
  }

  private createChannel(
    client: Socket,
    conversation: Conversation,
    user: User,
  ): Webrtc {
    return {
      conversation: conversation,
      users: [
        {
          socket: client,
          user: user,
        },
      ],
    };
  }
}
