import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Importe o serviço do Prisma
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDishDto: CreateDishDto) {
    // Crie um novo prato no banco de dados usando o Prisma
    const dish = await this.prismaService.dish.create({
      data: createDishDto,
    });
    return dish;
  }

  async findAll() {
    // Recupere todos os pratos do banco de dados usando o Prisma
    const dishes = await this.prismaService.dish.findMany();
    return dishes;
  }

  async findOne(id: number) {
    // Recupere um prato específico do banco de dados usando o Prisma
    const dish = await this.prismaService.dish.findUnique({
      where: { id },
    });

    if (!dish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    return dish;
  }

  async update(id: number, updateDishDto: UpdateDishDto) {
    // Atualize um prato específico no banco de dados usando o Prisma
    const updatedDish = await this.prismaService.dish.update({
      where: { id },
      data: updateDishDto,
    });

    if (!updatedDish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    return updatedDish;
  }

  async remove(id: number) {
    // Remova um prato específico do banco de dados usando o Prisma
    const deletedDish = await this.prismaService.dish.delete({
      where: { id },
    });

    if (!deletedDish) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    return deletedDish;
  }
}
