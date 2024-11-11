import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ValidateUsuarioDto } from '../usuarios/dto/validate-usuario.dto';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';

import { Role } from "../roles/entities/role.entity";
import { ConflictException } from '@nestjs/common'; 


@Injectable()
export class UsuariosService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    @InjectRepository(Role)
    private readonly roleRepository:Repository<Role>,
    private readonly jwtService: JwtService

  ){}

  async create(createUsuarioDto: CreateUsuarioDto) {
    // Verificar si el correo ya existe en la base de datos
    const existeCorreo = await this.usuarioRepository.findOneBy({
      correo: createUsuarioDto.correo,
    });
  
    if (existeCorreo) {
      throw new ConflictException('El correo ya está en uso');
    }
  
  
    createUsuarioDto.clave = await bcrypt.hash(createUsuarioDto.clave, 10);
  
   
    const roles = await this.roleRepository.find({
      where: createUsuarioDto.roles.map((roleNombre) => ({ nombre: roleNombre })),
    });
  
    if (roles.length !== createUsuarioDto.roles.length) {
      throw new NotFoundException('No se encontraron los roles requeridos');
    }
  
   
    const usuario = this.usuarioRepository.create({
      usuario: createUsuarioDto.usuario,
      clave: createUsuarioDto.clave,
      correo: createUsuarioDto.correo,
      roles: roles,
    });
  
 
    return this.usuarioRepository.save(usuario);
  }



/*
  async create(createUsuarioDto: CreateUsuarioDto) {
    createUsuarioDto.clave=await bcrypt.hash(createUsuarioDto.clave,10);
    
    //buscamos roles en base de datos
    const roles = await this.roleRepository.find({
      where: createUsuarioDto.roles.map((roleNombre) => ({ nombre: roleNombre }))
    });

    if (roles.length !== createUsuarioDto.roles.length) {
      throw new NotFoundException('No se encontraron los roles requeridos');
    }
    

    const usuario = this.usuarioRepository.create({
      usuario: createUsuarioDto.usuario,
      clave: createUsuarioDto.clave,
      correo: createUsuarioDto.correo,
      roles: roles
    });

    return this.usuarioRepository.save(usuario);
  }
*/

/*
  async validarUsuario(validateUsuarioDto:validateUsuarioDto):Promise<any>{

    const usuario=await this.usuarioRepository.findOne({where:{usuario:validateUsuarioDto.usuario}});
    if(!usuario)
        throw new NotFoundException('No se pudo verificar el usuario');
    const claveHasheada= await bcrypt.hash(validateUsuarioDto.clave,10);
    if(!await bcrypt.compare(claveHasheada,usuario.clave)){
      //return 'se valido la cuentaaa'
      throw new NotFoundException('No se pudo verificar el usuario')
    }
      

    return {usuario: usuario.usuario, message:'se valido la cuenta'}

  }
*/
async validarUsuario(validateUsuarioDto: ValidateUsuarioDto): Promise<any> {
  // Busca al usuario en la base de datos
  const usuario = await this.usuarioRepository.findOne({ where: { usuario: validateUsuarioDto.usuario },relations:['roles'] });
  const clav=await this.usuarioRepository.findOne({where:{clave: validateUsuarioDto.clave}})

  if (!usuario) {
    throw new NotFoundException('No se encontro el usuario');
  }
  

  const esClaveValida = await bcrypt.compare(validateUsuarioDto.clave, usuario.clave);
  
  
  if (esClaveValida) {

    const nombreRoles=usuario.roles.map(role => role.nombre);
    const payload = {
      usuario: usuario.usuario,
      id: usuario.id,
      roles: nombreRoles
    }
    return {
      access_token: this.jwtService.sign(payload)
    };
    
  }
    return 'No se encontro el usuario';
 
}

async findAll(): Promise<Usuario[]> {
  return this.usuarioRepository.find({ relations: ['roles'] });
}

async findOne(id: number): Promise<Usuario> {
  const usuario = await this.usuarioRepository.findOne({ where: { id }, relations: ['roles'] });
  if (!usuario) {
    throw new NotFoundException(`No se encontró el usuario con el ID ${id}`);
  }
  return usuario;
}

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  async remove(id: number): Promise<void> {
    const result = await this.usuarioRepository.softDelete(id);
  
    if (!result.affected) {
      throw new NotFoundException(`No se encontró el usuario con el ID ${id}`);
    }
  }
}