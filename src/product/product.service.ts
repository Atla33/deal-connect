import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // Crie um novo produto no banco de dados usando o Prisma
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll() {
    // Retorne todos os produtos do banco de dados
    return this.prisma.product.findMany();
  }

  async findOne(id: number) {
    // Retorne um produto específico com base no ID
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // Atualize um produto específico com base no ID
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    // Remova um produto específico com base no ID
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
