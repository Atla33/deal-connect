import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    // Crie um novo menu no banco de dados usando o Prisma
    return this.prisma.menu.create({
      data: createMenuDto,
    });
  }

  async findAll() {
    // Retorne todos os menus do banco de dados
    return this.prisma.menu.findMany();
  }

  async findOne(id: number) {
    // Retorne um menu específico com base no ID
    return this.prisma.menu.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    // Atualize um menu específico com base no ID
    return this.prisma.menu.update({
      where: { id },
      data: updateMenuDto,
    });
  }

  async remove(id: number) {
    // Remova um menu específico com base no ID
    return this.prisma.menu.delete({
      where: { id },
    });
  }
}