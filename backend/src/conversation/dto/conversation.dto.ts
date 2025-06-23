import { ApiProperty } from '@nestjs/swagger';

class BaseConversationDto {
  @ApiProperty({ default: 'uuid' })
  userId: string;
}

export class CreateConversationDto extends BaseConversationDto {}
export class JoinConversationDto extends BaseConversationDto {}
export class LeaveConversationDto extends BaseConversationDto {}
