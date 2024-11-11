import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Producto } from 'src/productos/entities/producto.entity';
import { Pedido } from './entities/pedido.entity';
import { ProductoPedido } from './entities/producto-pedido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Producto, Pedido, ProductoPedido, Usuario]), JwtModule.register({
    secret: 'test',
    signOptions: {
      expiresIn: 1200
    }
  })],
  controllers: [PedidosController],
  providers: [AuthService, PedidosService],
})
export class PedidosModule {}
