import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Sesion } from 'src/auth/sesion.decorator';
import { Roles } from 'src/auth/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('pedidos')
@UseGuards(JwtGuard, RolesGuard)
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  
  @ApiOperation({ summary: 'crear pedido'})
  @ApiResponse({ status: 200, description: 'producto creado'})
  @ApiResponse({ status: 404, description: 'usuario no autorizado'})
  
  @Post()
  @Roles(['USUARIO'])
  create(@Sesion() sesion, @Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto, sesion.id);
  }
  
  @ApiOperation({ summary: 'listar todos los pedidos'})
  @ApiResponse({ status: 200, description: 'lista de pedidos'})

  @Get()
  findAll() {
    return this.pedidosService.findAll();
  }
  @ApiOperation({ summary: 'detallar  pedido'})
  @ApiResponse({ status: 200, description: 'detalle de pedido'})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(+id);
  }

  @ApiOperation({ summary: 'ver estado de un pedido' })
  @ApiResponse({ status: 200, description: 'estado del pedido' })
  @ApiResponse({ status: 404, description: 'id no encontrado' })
  @Get(':id/estado')
  getEstado(@Param('id') id: string) {
    return this.pedidosService.getEstado(+id);
  }

  @ApiOperation({ summary: 'actualizar pedido'})
  @ApiResponse({ status: 200, description: 'estado actualizado'})
  @ApiResponse({ status: 404, description: 'id no encontrado'})
  @Patch(':id')
  @Roles(['ADMIN'])
  update(@Sesion() sesion, @Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidosService.update(+id, updatePedidoDto, sesion.id);
  }


  @ApiOperation({ summary: 'eliminar pedido'})
  @ApiResponse({ status: 200, description: 'pedido eliminado'})
  @ApiResponse({ status: 404, description: 'id no encontrado'})

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pedidosService.remove(+id);
  }

  @ApiOperation({ summary: 'atender pedido'})
  @ApiResponse({ status: 200, description: 'estado de pedido atendido'})
  @ApiResponse({ status: 404, description: 'id no encontrado'})
  @Patch(':id/atender')
  @Roles(['ADMIN'])
  atenderPedido(@Param('id') id: string, @Sesion() sesion) {
    return this.pedidosService.atenderPedido(+id, sesion.id);
  }
}
