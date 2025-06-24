import { Socket } from 'socket.io';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { User } from 'src/user/entities/user.entity';

export class Webrtc {
  conversation: Conversation;
  users: {
    socket: Socket;
    user: User;
  }[];
}
