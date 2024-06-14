import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { EmailService } from 'src/email/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ email: createUserDto.email }, { username: createUserDto.username }],
        },
      });

      if (existingUser) {
        throw new ConflictException('Email or username already taken');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const verificationCode = crypto.randomBytes(3).toString('hex');

      const data = {
        ...createUserDto,
        password: hashedPassword,
        emailVerificationCode: verificationCode,
        isVerified: false,
      };

      const createUser = await this.prisma.user.create({ data });

      console.log('Calling sendVerificationEmail');
      await this.emailService.sendVerificationEmail(createUser.email, verificationCode);

      return {
        ...createUser,
        password: undefined,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Could not create user');
    }
  }

  async verifyUser(email: string, code: string): Promise<{ message: string, user: User }> {
    try {
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isVerified) {
        throw new BadRequestException('User is already verified');
      }

      if (user.emailVerificationCode !== code) {
        throw new BadRequestException('Invalid verification code');
      }

      const updatedUser = await this.prisma.user.update({
        where: { email },
        data: {
          isVerified: true,
          emailVerificationCode: null,
        },
      });

      return {
        message: 'Cadastro validado com sucesso',
        user: {
          ...updatedUser,
          password: undefined, // Remova a senha dos dados retornados
        }
      };
    } catch (error) {
      console.error('Error verifying user:', error);
      throw new InternalServerErrorException('Could not verify user');
    }
  }

  async findByEmail(email: string) {
    try {
      return this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new InternalServerErrorException('Could not find user by email');
    }
  }

  async findByUsername(username: string) {
    try {
      return this.prisma.user.findUnique({
        where: { username },
      });
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw new InternalServerErrorException('Could not find user by username');
    }
  }

  async findOne(userId: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw new InternalServerErrorException('Could not find user by ID');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return this.prisma.user.findMany();
    } catch (error) {
      console.error('Error finding all users:', error);
      throw new InternalServerErrorException('Could not find users');
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      let hashedPassword;

      if (updateUserDto.password) {
        hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      }

      const data = {
        name: updateUserDto.name,
        phone: updateUserDto.phone,
        email: updateUserDto.email,
        password: hashedPassword || undefined,
      };

      const user = await this.prisma.user.update({
        where: { id: userId },
        data,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new InternalServerErrorException('Could not update user');
    }
  }

  async remove(userId: number): Promise<User> {
    try {
      const user = await this.prisma.user.delete({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new InternalServerErrorException('Could not delete user');
    }
  }
}
