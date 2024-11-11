import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "src/usuarios/entities/usuario.entity";

export class AuthService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ){

    }

    findOne(id: number) {
        return this.usuarioRepository.findOne({ where: { id }, relations: ['roles'] });
    }
}