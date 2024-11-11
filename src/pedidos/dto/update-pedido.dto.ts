import { IsIn } from "class-validator";
export class UpdatePedidoDto {
    @IsIn(['ATENDIDO', 'RECHAZADO'], { message: 'El estado no esta permitido'})
    estado: string;
}
