import { IsArray, IsString, isArray,IsEmail } from "class-validator";


export class CreateUsuarioDto {
    usuario: string;
    correo: string;
    clave: string;
    roles: string[]; // Array de nombres de roles (ej. ['admin', 'user'])
  }
  