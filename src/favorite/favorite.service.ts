import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorite } from '@prisma/client';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async create(createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
    const { userId, productId } = createFavoriteDto;

    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Favorite already exists');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!user || !product) {
      throw new NotFoundException('User or Product not found');
    }

    return this.prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async findAll(): Promise<Favorite[]> {
    return this.prisma.favorite.findMany();
  }

  async findOne(id: number): Promise<Favorite> {
    const favorite = await this.prisma.favorite.findUnique({
      where: { id },
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with id ${id} not found`);
    }

    return favorite;
  }

  async update(id: number, updateFavoriteDto: UpdateFavoriteDto): Promise<Favorite> {
    const { userId, productId } = updateFavoriteDto;

    const existingFavorite = await this.prisma.favorite.findUnique({
      where: { id },
    });

    if (!existingFavorite) {
      throw new NotFoundException(`Favorite with id ${id} not found`);
    }

    return this.prisma.favorite.update({
      where: { id },
      data: {
        userId,
        productId,
      },
    });
  }

  async remove(id: number): Promise<void> {
    const favorite = await this.prisma.favorite.findUnique({
      where: { id },
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with id ${id} not found`);
    }

    await this.prisma.favorite.delete({
      where: { id },
    });
  }
}
