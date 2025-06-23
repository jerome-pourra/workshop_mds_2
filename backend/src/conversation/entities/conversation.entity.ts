import { User } from 'src/user/entities/user.entity';

export class Conversation {
  uuid: string;
  owner: User;
  participants: User[];
}
