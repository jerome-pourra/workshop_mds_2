import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [UserModule, ConversationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
