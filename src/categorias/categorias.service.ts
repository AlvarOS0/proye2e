import { Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { PinoLoggerService } from "../core/pino-logger.service";
@Injectable()
export class CategoriasService {
  constructor(
    private readonly logger: PinoLoggerService,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ){

  }

  create(createCategoriaDto: CreateCategoriaDto) {
    this.logger.log('Creacion de categoria', 'CategoriaService');
    const categoria = this.categoriaRepository.create(createCategoriaDto);
    return this.categoriaRepository.save(categoria)
  }

  findAll() {
    return `This action returns all categorias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoria`;
  }

  update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return `This action updates a #${id} categoria`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoria`;
  }
}
