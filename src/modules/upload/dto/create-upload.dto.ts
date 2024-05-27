export class CreateUploadDto {
    fieldname: string;
    encoding: string;
    originalname: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}
