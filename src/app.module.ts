import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriasModule } from './categorias/categorias.module';
import { PinoLoggerService } from './core/pino-logger.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { RolesModule } from './roles/roles.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [PinoLoggerService],
  exports: [PinoLoggerService],
  imports: [
    ConfigModule.forRoot(), // Carga las variables de entorno desde el archivo .env
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: +process.env.BD_PUERTO,
      username: 'postgres',
      password: 'root',
      database: 'tienda',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ProductosModule,
    CategoriasModule,
    UsuariosModule,
    RolesModule,
    PedidosModule],
})
export class AppModule { }