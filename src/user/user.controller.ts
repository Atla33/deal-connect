import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @IsPublic()
  @Post('verify')
  verifyUser(@Body() verifyUserDto: { email: string; code: string }) {
    return this.userService.verifyUser(verifyUserDto.email, verifyUserDto.code);
  }

  @IsPublic()
  @Post('request-password-reset')
  requestPasswordReset(@Body() body: { email: string }) {
    return this.userService.requestPasswordReset(body.email);
  }

  @IsPublic()
  @Post('verify-reset-password-code')
  verifyResetPasswordCode(@Body() body: { email: string; code: string }) {
    return this.userService.verifyResetPasswordCode(body.email, body.code);
  }

  @IsPublic()
  @Post('reset-password')
  resetPassword(@Body() body: { email: string; newPassword: string }) {
    return this.userService.resetPassword(body.email, body.newPassword);
  }
}
