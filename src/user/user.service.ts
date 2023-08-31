import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) {}


  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verifica se já existe um usuário com o mesmo email ou username
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: createUserDto.email }, { username: createUserDto.username }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or username already taken');
    }

    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        phone: createUserDto.phone,
        email: createUserDto.email,
        username: createUserDto.username,
        password: createUserDto.password,
      },
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
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateUserDto.name,
        phone: updateUserDto.phone,
        email: updateUserDto.email,
        password: updateUserDto.password,
      },
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
