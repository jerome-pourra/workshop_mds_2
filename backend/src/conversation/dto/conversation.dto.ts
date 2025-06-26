import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID } from 'class-validator';

class BaseConversationDto {
  @IsUUID()
  @ApiProperty({ default: 'uuid' })
  userId: string;
}

export class CreateConversationDto extends BaseConversationDto { }
export class JoinConversationDto extends BaseConversationDto { }
export class LeaveConversationDto extends BaseConversationDto { }

export class AudioConversationDto {
  @IsUUID()
  @ApiProperty({ default: 'uuid' })
  userId: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class BaseTranscriptDto {
  @IsUUID()
  @ApiProperty({ default: 'uuid' })
  userId: string;
}

export class TranscriptConversationDto extends BaseTranscriptDto { }
export class FormatTranscriptConversationDto extends BaseTranscriptDto { }
