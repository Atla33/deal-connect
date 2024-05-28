import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import * as fs from 'fs';
import * as util from 'util';
import { createClient } from '@supabase/supabase-js';

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

  private supabaseURL = 'https://wpeocejczalxaxthbzaa.supabase.co';
  private supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwZW9jZWpjemFseGF4dGhiemFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMzM4MjY3NSwiZXhwIjoyMDI4OTU4Njc1fQ.35ObpnSKYaVJK0pV1A7D7pLyWDC6xXO2ag8rkzHIJ7s';
  private supabase = createClient(this.supabaseURL, this.supabaseKey, {
    auth: { persistSession: false }
  });

  async upload(createUploadDto: CreateUploadDto): Promise<{ message: string; url: string }> {
    const filePath = `public/${Date.now()}-${createUploadDto.originalname}`;

    const uploadResult = await this.supabase.storage.from('Images').upload(filePath, createUploadDto.buffer, {
      upsert: true,
      cacheControl: '157680000',
    });

    if (uploadResult.error) {
      throw new Error('Failed to upload image: ' + uploadResult.error.message);
    }

    const fiveYearsInSeconds = 157680000;  
    const signedUrlResult = await this.supabase.storage.from('Images').createSignedUrl(filePath, fiveYearsInSeconds);
    if (signedUrlResult.error) {
      throw new Error('Failed to create signed URL: ' + signedUrlResult.error.message);
    }

    return {
      message: 'Upload successful!',
      url: signedUrlResult.data.signedUrl
    };
  }
}
