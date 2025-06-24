import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { PayloadWebrtcDto } from './dto/webrtc.dto';
import { WebrtcService } from './webrtc.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'webrtc',
  cors: {
    origin: '*',
  },
})
export class WebrtcGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger(WebrtcGateway.name)

  constructor(private readonly webrtcService: WebrtcService) { }

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join')
  join(client: Socket, payload: PayloadWebrtcDto) {
    try {
      const user = this.webrtcService.join(client, payload);
      this.logger.debug(`User ${user.uuid} joined WebRTC channel in conversation ${payload.conversationUuid}`);
      client.join(payload.conversationUuid);
      client.broadcast.to(payload.conversationUuid).emit('join', user);
    } catch (error) {
      this.logger.error(`Error joining WebRTC channel: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('leave')
  leave(client: Socket, payload: PayloadWebrtcDto) {
    try {
      const user = this.webrtcService.leave(payload);
      this.logger.debug(`User ${user.uuid} left WebRTC channel in conversation ${payload.conversationUuid}`);
      client.leave(payload.conversationUuid);
      client.broadcast.to(payload.conversationUuid).emit('leave', user);
    } catch (error) {
      this.logger.error(`Error leaving WebRTC channel: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('offer')
  offer(client: Socket, payload: PayloadWebrtcDto) {
    try {
      const user = this.webrtcService.findUser(payload.conversationUuid, payload.userUuid);
      this.logger.debug(`Offer received from user ${user.uuid} in conversation ${payload.conversationUuid}`);
      client.broadcast.to(payload.conversationUuid).emit('offer', payload.data);
    } catch (error) {
      this.logger.error(`Error processing offer: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('answer')
  answer(client: Socket, payload: PayloadWebrtcDto) {
    try {
      const user = this.webrtcService.findUser(payload.conversationUuid, payload.userUuid);
      this.logger.debug(`Answer received from user ${user.uuid} in conversation ${payload.conversationUuid}`);
      client.broadcast.to(payload.conversationUuid).emit('answer', payload.data);
    } catch (error) {
      this.logger.error(`Error processing answer: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('ice-candidate')
  iceCandidate(client: Socket, payload: PayloadWebrtcDto) {
    try {
      const user = this.webrtcService.findUser(payload.conversationUuid, payload.userUuid);
      this.logger.debug(`Ice-candidate received from user ${user.uuid} in conversation ${payload.conversationUuid}`);
      client.broadcast.to(payload.conversationUuid).emit('ice-candidate', payload.data);
    } catch (error) {
      this.logger.error(`Error processing ice-candidate: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }
}
