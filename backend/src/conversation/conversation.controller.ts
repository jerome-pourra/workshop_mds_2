import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import {
  CreateConversationDto,
  JoinConversationDto,
  LeaveConversationDto,
} from './dto/conversation.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post()
  create(@Body() createConversationDto: CreateConversationDto) {
    return this.conversationService.create(createConversationDto);
  }

  @Post(':uuid/join')
  join(
    @Param('uuid') uuid: string,
    @Body() joinConversationDto: JoinConversationDto,
  ) {
    return this.conversationService.join(uuid, joinConversationDto);
  }

  @Post(':uuid/leave')
  leave(
    @Param('uuid') uuid: string,
    @Body() leaveConversationDto: LeaveConversationDto,
  ) {
    return this.conversationService.leave(uuid, leaveConversationDto);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.conversationService.findOne(uuid);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.conversationService.remove(uuid);
  }
}
