import { Controller, Get, Post, Param, Body, Delete, Put, UseInterceptors, UploadedFile, NotFoundException, Res, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { UploadService } from './upload.service';
import { Response } from 'express';


@Controller('uploads')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post("/")
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: CreateUploadDto ) {
    const result = await this.uploadService.upload(file);
    return result;

  }

  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.uploadService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(id, updateUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.uploadService.remove(id);
  }

  @Get(':id/download')
  async download(@Param('id') id: number, @Res() res: Response) {
    try {
      const upload = await this.uploadService.findOne(id);
      res.sendFile(upload.path, { root: '.' });
    } catch (error) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }
}
