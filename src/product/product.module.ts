import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadModule } from 'src/modules/upload/upload.module';
import { ProductController } from './product.controller';

@Module({
  imports: [UploadModule],
  controllers: [ProductController],  
  providers: [ProductService, PrismaService]
})
export class ProductModule {}
