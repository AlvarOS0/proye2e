import { IsString } from "class-validator";
export class CreateRoleDto {
    @IsString({ message: 'El nombre del rol debe ser texto'})
    nombre: string;
}
