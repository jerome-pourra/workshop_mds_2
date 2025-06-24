import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConversationModule } from './conversation/conversation.module';
import { WebrtcModule } from './webrtc/webrtc.module';

@Module({
  imports: [UserModule, ConversationModule, WebrtcModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
