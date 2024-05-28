// upload.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, 'assets', 'images'),  // Certifique-se de que este diretório existe ou é criado
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now().toString(36) + randomBytes(8).toString('hex');
          const cleanName = file.originalname.replace(/\s+/g, '').replace(/[^a-zA-Z0-9.]/g, '');
          const filename = `${cleanName}-${uniqueSuffix}`;
          callback(null, filename);
        }
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // Limite de tamanho do arquivo de 5MB
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true); // Aceitar apenas formatos de imagem específicos
        } else {
          cb(new Error('Unsupported file type'), false); // Rejeitar outros tipos de arquivo
        }
      }
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService], // Adicione esta linha
})
export class UploadModule {}
