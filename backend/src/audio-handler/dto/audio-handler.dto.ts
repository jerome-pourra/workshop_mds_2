import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsUUID } from "class-validator";

export class MessageAudioHandlerDto {
  type: string;
  data: any;
}

export class PingAudioHandlerDto {
  @IsInt()
  @ApiProperty({ default: '' })
  sendAt: number;
}

export class PongAudioHandlerDto {
  clientSendAt: number;
  serverReceiveAt: number;
}

export class ChunkAudioHandlerDto {
  @IsArray()
  @ApiProperty({ default: '' })
  chunk: Uint8Array[];
}

export class JoinAudioHandlerDto {
  @IsUUID()
  @ApiProperty({ default: 'uuid' })
  userId: string;

  @IsUUID()
  @ApiProperty({ default: 'uuid' })
  conversationId: string;
}

export class LeaveAudioHandlerDto {
  @IsUUID()
  @ApiProperty({ default: 'uuid' })
  userId: string;

  @IsUUID()
  @ApiProperty({ default: 'uuid' })
  conversationId: string;
}
