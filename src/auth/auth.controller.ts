import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt-auth.guard';


  
  @Controller()
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @IsPublic()
    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    login(@Request() req: AuthRequest){
      return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('auth-profile')
    getProfile(@Request() req) {
    return req.user;
    }

    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('Roles')
    getRole(){
      return "Foi"
    }

    @UseGuards(RefreshJwtAuthGuard)
    @Post('refresh')
    async refreshToken(@Request() req) {
      return this.authService.refreshToken(req.user);
    }
  }
