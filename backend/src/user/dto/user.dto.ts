import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ default: 'John' })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ default: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastname: string;
}
