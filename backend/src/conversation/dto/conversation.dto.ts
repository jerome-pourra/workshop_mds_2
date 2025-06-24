import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID } from 'class-validator';

class BaseConversationDto {
  @IsUUID()
  @ApiProperty({ default: 'uuid' })
  userId: string;
}

export class CreateConversationDto extends BaseConversationDto {
  @IsInt()
  @ApiProperty({ default: 2 })
  maxMembers: number;
}
export class JoinConversationDto extends BaseConversationDto {}
export class LeaveConversationDto extends BaseConversationDto {}
