import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
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
