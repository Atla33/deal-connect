import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorite } from '@prisma/client'; // Certifique-se de importar os tipos corretos do Prisma

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async create(createFavoriteDto: CreateFavoriteDto): Promise<Favorite> {
    const { userId, favoritedUserId } = createFavoriteDto;

    // Verifique se o usuário está tentando se favoritar
    if (userId === favoritedUserId) {
      throw new ConflictException('User cannot favorite themselves');
    }

    // Verifique se o usuário já favoritou o outro usuário
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: {
        userId_favoritedUserId: {
          userId,
          favoritedUserId,
        },
      },
    });

    if (existingFavorite) {
      throw new ConflictException('Favorite already exists');
    }

    // Verifique se os usuários existem antes de criar o favorito
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    const favoritedUser = await this.prisma.user.findUnique({
      where: { id: favoritedUserId },
    });

    if (!user || !favoritedUser) {
      throw new NotFoundException('User(s) not found');
    }

    // Use Prisma para criar um favorito no banco de dados
    return this.prisma.favorite.create({
      data: {
        userId,
        favoritedUserId,
      },
    });
  }

  async findAll(): Promise<Favorite[]> {
    // Use Prisma para buscar todos os favoritos no banco de dados
    return this.prisma.favorite.findMany();
  }

  async findOne(id: number): Promise<Favorite> {
    // Use Prisma para buscar um favorito específico no banco de dados
    const favorite = await this.prisma.favorite.findUnique({
      where: { id },
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with id ${id} not found`);
    }

    return favorite;
  }

  async update(id: number, updateFavoriteDto: UpdateFavoriteDto): Promise<Favorite> {
    const { userId, favoritedUserId } = updateFavoriteDto;

    // Verifique se o favorito existe antes de atualizá-lo
    const existingFavorite = await this.prisma.favorite.findUnique({
      where: { id },
    });

    if (!existingFavorite) {
      throw new NotFoundException(`Favorite with id ${id} not found`);
    }

    // Use Prisma para atualizar o favorito no banco de dados
    return this.prisma.favorite.update({
      where: { id },
      data: {
        userId,
        favoritedUserId,
      },
    });
  }

  async remove(id: number): Promise<void> {
    // Use Prisma para remover um favorito do banco de dados
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
