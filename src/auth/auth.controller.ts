import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
  
  @Controller()
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    login(@Request() req){
      return this.authService.login(req.user);
    }
  }
