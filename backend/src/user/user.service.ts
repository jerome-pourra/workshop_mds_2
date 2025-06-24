import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly users: User[] = [];

  create(createUserDto: CreateUserDto): User {
    const newUser: User = {
      uuid: crypto.randomUUID(),
      firstname: createUserDto.firstname,
      lastname: createUserDto.lastname,
      createdAt: Date.now(),
    };
    this.users.push(newUser);
    return newUser;
  }

  findOne(uuid: string): User {
    const user = this.users.find((user) => user.uuid === uuid);
    if (!user) {
      throw new NotFoundException(`User with uuid ${uuid} not found`);
    }
    return user;
  }

  remove(uuid: string): { message: string } {
    const userIndex = this.users.findIndex((user) => user.uuid === uuid);
    if (userIndex === -1) {
      throw new NotFoundException(`User with uuid ${uuid} not found`);
    }
    this.users.splice(userIndex, 1);
    return { message: `User with uuid ${uuid} has been removed` };
  }
}
