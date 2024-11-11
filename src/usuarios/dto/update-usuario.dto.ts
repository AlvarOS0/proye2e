import { PartialType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';
export class UpdateUsuarioDto {
    usuario?: string;
    correo?: string;
    clave?: string;
    roles?: string[];
  }
  