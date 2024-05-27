import { diskStorage } from 'multer';
import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

export const multerOptions = {
    storage: diskStorage({
        destination: 'assets/images',
        filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
            const nameSplit = file.originalname.split('.');
            const fileExt = nameSplit[nameSplit.length - 1];
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            callback(null, `${uniqueSuffix}.${fileExt}`);
        }
    }),
    fileFilter: (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new BadRequestException('Unsupported file type'), false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 50 }
};
