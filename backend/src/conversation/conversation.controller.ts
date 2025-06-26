import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import {
  CreateConversationDto,
  FormatTranscriptConversationDto,
  JoinConversationDto,
  LeaveConversationDto,
  TranscriptConversationDto,
} from './dto/conversation.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('conversation')
export class ConversationController {
  public static readonly MAX_FILE_SIZE = 50 * 1024 * 1024;
  public static readonly ALLOWED_FILE_TYPES = [
    'audio/flac',
    'audio/m4a',
    'audio/mp3',
    'audio/mpeg',
    'audio/mpga',
    'audio/oga',
    'audio/ogg',
    'audio/wav',
    'audio/webm',
    'video/webm',
  ];

  constructor(private readonly conversationService: ConversationService) { }

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

  @Post(':uuid/audio')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: ConversationController.MAX_FILE_SIZE },
      dest: './uploads',
      fileFilter: (req, file, cb) => {
        if (ConversationController.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
        }
      },
    }),
  )
  audio(
    @Param('uuid') uuid: string,
    @Body('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.conversationService.audio(uuid, {
      userId,
      file,
    });
  }

  @Post(':uuid/transcript')
  transcript(
    @Param('uuid') uuid: string,
    @Body() body: TranscriptConversationDto,
  ) {
    return this.conversationService.transcript(uuid, body);
  }

  @Post(':uuid/format-transcript')
  formatTranscript(
    @Param('uuid') uuid: string,
    @Body() body: FormatTranscriptConversationDto,
  ) {
    return this.conversationService.formatTranscription(uuid, body);
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.conversationService.findOne(uuid);
  }

  @Get()
  findAll() {
    return this.conversationService.findAll();
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.conversationService.remove(uuid);
  }
}
