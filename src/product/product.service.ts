import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as fs from 'fs/promises';
import { UploadService } from 'src/modules/upload/upload.service';
import { CreateUploadDto } from 'src/modules/upload/dto/create-upload.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService
  ) {}

  async create(createProductDto: CreateProductDto, imageFile: Express.Multer.File) {
    if (!imageFile) {
      throw new BadRequestException('Imagem do produto é obrigatória');
    }
  
    const userId = Number(createProductDto.userId);
    if (isNaN(userId)) {
      throw new BadRequestException('UserId deve ser um número válido');
    }
  
    const uploadDto: CreateUploadDto = {
      fieldname: imageFile.fieldname,
      originalname: imageFile.originalname,
      encoding: imageFile.encoding,
      mimetype: imageFile.mimetype,
      buffer: await fs.readFile(imageFile.path),
      size: imageFile.size,
    };
  
    const uploadResult = await this.uploadService.upload(uploadDto);
  
    return this.prisma.product.create({
      data: {
        ...createProductDto,
        userId: userId,
        image: uploadResult.url
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
  
    let userId = updateProductDto.userId;
    if (typeof userId === 'string') {
      userId = Number(userId);
      if (isNaN(userId)) {
        throw new BadRequestException('UserId deve ser um número válido');
      }
      updateProductDto.userId = userId;
    }
  
    if (imageFile) {
      const validMimeTypes = ['image/jpeg', 'image/png'];
      if (!validMimeTypes.includes(imageFile.mimetype)) {
        throw new BadRequestException('Tipo de arquivo não suportado. Por favor, envie apenas JPEG ou PNG.');
      }
  
      const uploadDto: CreateUploadDto = {
        fieldname: imageFile.fieldname,
        originalname: imageFile.originalname,
        encoding: imageFile.encoding,
        mimetype: imageFile.mimetype,
        buffer: await fs.readFile(imageFile.path),
        size: imageFile.size,
      };
  
      // O upload pode lançar uma exceção se falhar
      const uploadResult = await this.uploadService.upload(uploadDto);
  
      // Atualiza a URL da imagem no DTO do produto se o upload for bem-sucedido
      updateProductDto.image = uploadResult.url;
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

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async findByUserId(userId: number) {
    const userIdNumber = Number(userId);
    if (isNaN(userIdNumber)) {
      throw new BadRequestException('UserId deve ser um número válido');
    }
  
    const products = await this.prisma.product.findMany({
      where: {
        userId: userIdNumber,
      },
      include: {
        user: true,
      },
    });
  
    if (products.length === 0) {
      throw new NotFoundException(`Nenhum produto encontrado para o userId ${userId}`);
    }
  
    return products;
  }
}
