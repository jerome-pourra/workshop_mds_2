import { Module } from '@nestjs/common';
import { WebrtcGateway } from './webrtc.gateway';
import { WebrtcService } from './webrtc.service';
import { UserModule } from 'src/user/user.module';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  providers: [WebrtcGateway, WebrtcService],
  imports: [UserModule, ConversationModule],
})
export class WebrtcModule {}
