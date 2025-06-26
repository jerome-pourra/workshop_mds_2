import { User } from 'src/user/entities/user.entity';

export class Conversation {
  uuid: string;
  owner: User;
  members: (User & { isOwner: boolean })[];
  maxMembers: number;
  createdAt: number;
  updatedAt: number;
  audioFile: Express.Multer.File | null;
  transcript?: {
    text: string;
    duration: number;
  };
  formattedTranscript?: string | null;
}
