import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';
import { User } from '../entities/user.entity';

export class CreateUserDto implements User {

  id: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  emailVerificationCode: string;

  isVerified: boolean;

  @IsString()
  passwordResetCode: string;

}