import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: createUserDto.email }, { username: createUserDto.username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or username already taken');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const data = {
      ...createUserDto,
      password: hashedPassword,
    };

    const createUser = await this.prisma.user.create({ data });

    return {
      ...createUser,
      password: undefined,
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findOne(userId: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
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
  }

  async remove(userId: number): Promise<User> {
    const user = await this.prisma.user.delete({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
