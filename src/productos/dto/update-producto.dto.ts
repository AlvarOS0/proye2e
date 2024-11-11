import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductoDto {
    @ApiProperty({ description: 'Nombre del producto', example: 'Producto A' })
    @IsOptional() // Hacer este campo opcional
    @IsString({ message: 'El nombre del producto debe ser una cadena' })
    nombre?: string; // Cambiado a opcional

    @ApiProperty({ description: 'Precio del producto', example: 19.90 })
    @IsOptional() // Hacer este campo opcional
    @IsNumber({}, { message: 'El precio debe ser numérico' })
    precio?: number; // Cambiado a opcional
}