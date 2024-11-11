import { Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categoria } from './entities/categoria.entity';
import { PinoLoggerService } from 'src/core/pino-logger.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([ Categoria]),
  ],
  controllers: [CategoriasController],
  providers: [CategoriasService, PinoLoggerService],
  exports: [PinoLoggerService]
})
export class CategoriasModule {}