import { Controller, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { ValidateUsuarioDto } from './dto/validate-usuario.dto';  // Importación corregida
import { Usuario } from './entities/usuario.entity';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  /**
   * Endpoint para validar usuario
   * @param validateUsuarioDto Datos del usuario a validar
   * @returns Token de acceso si las credenciales son correctas
   */
  @Post('validar')
  async validarUsuario(@Body() validateUsuarioDto: ValidateUsuarioDto): Promise<any> {
    // Llama al servicio para validar el usuario
    return this.usuariosService.validarUsuario(validateUsuarioDto);
  }

  /**
   * Endpoint para obtener todos los usuarios
   * @returns Lista de usuarios
   */
  @Post('todos')
  async findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  /**
   * Endpoint para obtener un usuario por su ID
   * @param id ID del usuario
   * @returns Usuario encontrado
   */
  @Post(':id')
  async findOne(@Body() id: number): Promise<Usuario> {
    return this.usuariosService.findOne(id);
  }
}
