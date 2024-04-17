import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import * as fs from 'fs';
import * as util from 'util';

const unlinkAsync = util.promisify(fs.unlink);

@Injectable()
export class UploadService {
  private uploads: any[] = [];

  create(createUploadDto: CreateUploadDto, file: Express.Multer.File) {
    const upload = {
      id: this.uploads.length + 1,
      ...createUploadDto,
      filename: file.filename,
      path: file.path,
    };
    this.uploads.push(upload);
    return upload;
  }

  findAll() {
    return this.uploads;
  }

  findOne(id: number) {
    const upload = this.uploads.find(u => u.id === id);
    if (!upload) {
      throw new NotFoundException(`Upload with ID ${id} not found`);
    }
    return upload;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    const uploadIndex = this.uploads.findIndex(u => u.id === id);
    if (uploadIndex === -1) {
      throw new NotFoundException(`Upload with ID ${id} not found`);
    }
    const updatedUpload = { ...this.uploads[uploadIndex], ...updateUploadDto };
    this.uploads[uploadIndex] = updatedUpload;
    return updatedUpload;
  }

  async remove(id: number) {
    const uploadIndex = this.uploads.findIndex(u => u.id === id);
    if (uploadIndex === -1) {
      throw new NotFoundException(`Upload with ID ${id} not found`);
    }
    try {
      await unlinkAsync(this.uploads[uploadIndex].path);
      this.uploads.splice(uploadIndex, 1);
      return { message: `Upload ${id} deleted successfully` };
    } catch (error) {
      throw new NotFoundException(`Failed to delete file: ${error.message}`);
    }
  }
}
