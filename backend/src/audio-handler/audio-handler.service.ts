import { Inject, Injectable } from '@nestjs/common';
import { ConversationService } from 'src/conversation/conversation.service';
import { UserService } from 'src/user/user.service';
import { ChunkAudioHandlerDto, PingAudioHandlerDto, PongAudioHandlerDto } from './dto/audio-handler.dto';

@Injectable()
export class AudioHandlerService {
  @Inject(UserService) private readonly userService: UserService;
  @Inject(ConversationService) private readonly conversationService: ConversationService;
  private readonly clients: { socketId: string, userId: string; conversationId: string }[] = [];

  addClient(socketId: string, userId: string, conversationId: string): void {
    this.clients.push({ socketId, userId, conversationId });
  }

  removeClient(socketId: string): void {
    const index = this.clients.findIndex(client => client.socketId === socketId);
    if (index !== -1) {
      this.clients.splice(index, 1);
    }
  }

  getClient(clientId: string): { socketId: string, userId: string; conversationId: string } | null {
    return this.clients.find(client => client.socketId === clientId) ?? null;
  }

  ping(pingAudioHandlerDto: PingAudioHandlerDto): PongAudioHandlerDto {
    return {
      clientSendAt: pingAudioHandlerDto.sendAt,
      serverReceiveAt: Date.now(),
    };
  }

  chunk(chunkAudioHandlerDto: ChunkAudioHandlerDto): void {

  }

}
