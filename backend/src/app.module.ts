import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConversationModule } from './conversation/conversation.module';
import { AudioHandlerModule } from './audio-handler/audio-handler.module';

@Module({
  imports: [UserModule, ConversationModule, AudioHandlerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
