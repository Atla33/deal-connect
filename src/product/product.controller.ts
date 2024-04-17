import { Controller, Get, Post, Patch, Delete, Param, Body, BadRequestException, UseGuards, UploadedFile, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { multerOptions } from './multer.config';

@Controller('product')
@Roles(Role.USER)
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(@Body() createProductDto: CreateProductDto, @UploadedFile() imageFile: Express.Multer.File) {
    if (!imageFile) {
      throw new BadRequestException('A imagem é obrigatória para a criação do produto.');
    }
    return this.productService.create(createProductDto, imageFile);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto, @UploadedFile() imageFile?: Express.Multer.File) {
    return this.productService.update(id, updateProductDto, imageFile);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
