import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  controllers: [ProductController],
  providers: [ProductService], // Certifique-se de listar apenas os serviços que você realmente implementou
  exports: [ProductService] // Exporta apenas o que é necessário
})
export class ProductModule {}
