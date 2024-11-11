import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { FileService } from 'src/common/file.service';

@Module({
  imports: [ TypeOrmModule.forFeature([Producto, Categoria, Usuario]), JwtModule.register({
    secret: 'test',
    signOptions: {
      expiresIn: 1200
    }
  })],
  controllers: [ProductosController],
  providers: [AuthService, ProductosService, FileService],
})
export class ProductosModule {}
