export class CreateUploadDto {
    fieldname: string;
    originalname: string;
    mimetype: string;
    buffer: Buffer;
    size: number;  
}
