import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("/")
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: CreateUploadDto ) {
    const result = await this.uploadService.upload(file);
    return result;

  }

}
