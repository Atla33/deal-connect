import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, imageFile: Express.Multer.File) {
    if (!imageFile) {
      throw new BadRequestException('Imagem do produto é obrigatória');
    }

    const imageFileName = uuidv4() + path.extname(imageFile.originalname);
    const imagePath = path.join(__dirname, '..', '..', 'assets', 'images', imageFileName);

    try {
      await sharp(imageFile.buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toFile(imagePath); 
    } catch (error) {
      throw new Error('Erro ao comprimir e salvar a imagem');
    }

    return this.prisma.product.create({
      data: {
        ...createProductDto,
        image: `images/${imageFileName}`,
      },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto, imageFile?: Express.Multer.File) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException('Produto não encontrado');
    }

    if (imageFile) {
      const existingImagePath = path.join(__dirname, '..', '..', 'assets', 'images', existingProduct.image);
      try {
        await fs.unlink(existingImagePath);
      } catch (err) {
        if (err.code !== 'ENOENT') { 
          throw new Error('Erro ao remover a imagem existente');
        }
      }

      const imageFileName = uuidv4() + path.extname(imageFile.originalname);
      const imagePath = path.join(__dirname, '..', '..', 'assets', 'images', imageFileName);

      try {
        await sharp(imageFile.buffer)
          .resize(800)
          .jpeg({ quality: 80 })
          .toFile(imagePath);
      } catch (error) {
        throw new Error('Erro ao comprimir e salvar a nova imagem');
      }

      updateProductDto.image = `images/${imageFileName}`;
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        user: true, 
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    return product;
  }

  async remove(id: number) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    // Remova a imagem associada ao produto, se existir
    if (existingProduct.image) {
      await this.deleteImage(existingProduct.image);
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  private async deleteImage(imagePath: string) {
    const fullPath = path.join(__dirname, '..', '..', 'assets', 'images', imagePath);
    try {
      if (await fs.stat(fullPath)) {
        await fs.unlink(fullPath);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw new Error(`Erro ao remover a imagem: ${error.message}`);
      }
    }
  }

}
