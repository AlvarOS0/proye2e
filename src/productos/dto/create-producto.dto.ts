import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
    @ApiProperty({description: 'Nombre del producto', example: 'Producto A'})
    @IsString({ message: 'El nombre del producto debe ser una cadena' })
    nombre: string;

    @ApiProperty({description: 'Precio del producto', example: 19.90 })
    @IsNumber({}, { message: 'El precio debe ser numérico' })
    precio: number;

    @ApiProperty({description: 'ID de la categoría del producto', example: 1})
    @IsNumber({}, { message: 'El idCategoria deberia ser numerico'})
    idCategoria: number;
}
