
import { diskStorage } from 'multer';
import { Request } from 'express';

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
        if (file.mimetype.startsWith('image/')) {
            callback(null, true);
        } else {
            callback(new Error('Unsupported file type'), false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB
};
