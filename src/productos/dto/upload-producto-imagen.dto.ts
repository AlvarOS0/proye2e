import { IsString, IsBase64 } from "class-validator";

export class UploadProductoImagenDto{
    @IsString({ message: 'La imagen debe ser texto'})
    @IsBase64({}, {message: 'La imagen debe ser en formato base64'})
    imagen: string;

    @IsString({ message: 'El nombre de la imagen debe ser texto'})
    nombre: string;
}