import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { AudioHandlerService } from './audio-handler.service';
import { ChunkAudioHandlerDto, PingAudioHandlerDto } from './dto/audio-handler.dto';
import { Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'audio-handler',
})
export class AudioHandlerGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly audioHandlerService: AudioHandlerService) { }

  handleConnection(socket: Socket) {
    const { userId, conversationId } = socket.handshake.query as { userId: string; conversationId: string };
    socket.join(conversationId);
    this.audioHandlerService.addClient(socket.id, userId, conversationId);
    console.log(`New client connected ${socket.id} joined conversation ${conversationId} as user ${userId}`);
  }

  handleDisconnect(socket: Socket) {
    const { userId, conversationId } = this.audioHandlerService.getClient(socket.id)!;
    socket.leave(conversationId);
    console.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('ping')
  ping(@MessageBody() pingAudioHandlerDto: PingAudioHandlerDto, @ConnectedSocket() socket: Socket) {
    const pongAudioHandlerDto = this.audioHandlerService.ping(pingAudioHandlerDto);
    socket.emit('pong', pongAudioHandlerDto);
  }

  @SubscribeMessage('chunk')
  chunk(@MessageBody() chunkAudioHandlerDto: ChunkAudioHandlerDto, @ConnectedSocket() socket: Socket) {
    this.audioHandlerService.chunk(chunkAudioHandlerDto);
    const { userId, conversationId } = this.audioHandlerService.getClient(socket.id)!;
    socket.broadcast.to(conversationId).emit('chunk', {
      from: userId,
      chunk: chunkAudioHandlerDto.chunk,
      sendAt: Date.now(),
    });
  }
}
