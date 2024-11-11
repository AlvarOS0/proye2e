import { IsArray, IsIn, IsInt, ValidateNested } from "class-validator";
import { Type } from 'class-transformer';

class ProductoPedidoDto {
    @IsInt({message: 'IdProducto debe ser numérico'})
    idProducto: number;

    @IsInt({ message: 'cantidad debe ser numérico'})
    cantidad: number;
}


export class CreatePedidoDto {
    @IsArray({message: 'Revise los datos en productos'})
    @ValidateNested({ each: true})
    @Type(() => ProductoPedidoDto)
    productos: ProductoPedidoDto[];
}
