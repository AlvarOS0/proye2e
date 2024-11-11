import { IsString } from "class-validator";
import { Usuario } from "../entities/usuario.entity";

export class ValidateUsuarioDto {
    usuario: string;
    clave: string;
  }
  