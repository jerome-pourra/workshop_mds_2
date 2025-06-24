import { Module } from '@nestjs/common';
import { AudioHandlerService } from './audio-handler.service';
import { AudioHandlerGateway } from './audio-handler.gateway';
import { UserModule } from 'src/user/user.module';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  imports: [UserModule, ConversationModule],
  providers: [AudioHandlerGateway, AudioHandlerService],
})
export class AudioHandlerModule {}
