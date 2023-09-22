import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { DishModule } from './dish/dish.module';
import { ProductModule } from './product/product.module';
import { MenuModule } from './menu/menu.module';
import { FavoriteModule } from './favorite/favorite.module';


@Module({
  imports: [PrismaModule,AuthModule, UserModule, DishModule, ProductModule, MenuModule, FavoriteModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },],
})
export class AppModule {}
