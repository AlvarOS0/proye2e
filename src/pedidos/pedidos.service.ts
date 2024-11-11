import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { ProductoPedido } from './entities/producto-pedido.entity';
import { Pedido } from './entities/pedido.entity';
import { PedidoDto, ProductoDto } from './interface/pedido.interface';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class PedidosService {
  private client = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: { host: 'localhost', port: 8877 },//Conectar al microservicio de notificaciones en el puerto 8877
  });

  private clientFacturacion = ClientProxyFactory.create({
    transport: Transport.TCP,
    options: { host: 'localhost', port: 3001 },//Conectar al microservicio de facturacion en el puerto 3001
  });

  constructor(
    @InjectRepository(Pedido)
    private pedidoRepository: Repository<Pedido>,
    @InjectRepository(ProductoPedido)
    private productoPedidoRepository: Repository<ProductoPedido>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private dataSource: DataSource,
  ) {

  }
  async create(createPedidoDto: CreatePedidoDto, usuarioCreacion: number): Promise<Pedido> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const nuevoPedido = new Pedido();
      nuevoPedido.fecha = new Date();
      nuevoPedido.idUsuarioCreacion = usuarioCreacion;
      const pedidoCreado = await queryRunner.manager.save(nuevoPedido);

      for (const productoPedidoDto of createPedidoDto.productos) {
        const producto = await this.productoRepository.findOne({ where: { id: productoPedidoDto.idProducto } });
        if (!producto) {
          throw new BadRequestException(`El producto con id ${productoPedidoDto.idProducto} no existe`);
        }

        const nuevoProductoPedido = new ProductoPedido();
        nuevoProductoPedido.pedido = pedidoCreado;
        nuevoProductoPedido.producto = producto;
        nuevoProductoPedido.cantidad = productoPedidoDto.cantidad;

        await queryRunner.manager.save(nuevoProductoPedido);
      }

      await queryRunner.commitTransaction();
      return pedidoCreado;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`No se pudo realizar la creacion del pedido: ${error.message}`)
    } finally {
      await queryRunner.release();
    }

  }

  async findAll(): Promise<PedidoDto[]> {
    const pedidos = await this.pedidoRepository.createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.productos', 'productoPedido')
      .leftJoinAndSelect('productoPedido.producto', 'producto')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .select([
        'pedido.id',
        'pedido.fecha',
        'productoPedido.cantidad',
        'producto.nombre',
        'categoria.nombre',
      ])
      .getMany();

    return pedidos.map((pedido) => ({
      id: pedido.id,
      fecha: pedido.fecha,
      productos: pedido.productos.map((productoPedido) => ({
        nombre: productoPedido.producto.nombre,
        categoria: productoPedido.producto?.categoria?.nombre || '',
        cantidad: productoPedido.cantidad,
      }))
    }))
  }

  async findOne(id: number) {
    const pedido = await this.pedidoRepository.createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.productos', 'productoPedido')
      .leftJoinAndSelect('productoPedido.producto', 'producto')
      .leftJoinAndSelect('producto.categoria', 'categoria')
      .select([
        'pedido.id',
        'pedido.fecha',
        'productoPedido.cantidad',
        'producto.nombre',
        'categoria.nombre',
      ])
      .where({ id: id})
      .getOne();

    return {
      id: pedido.id,
      fecha: pedido.fecha,
      productos: pedido.productos.map((productoPedido) => ({
        nombre: productoPedido.producto.nombre,
        categoria: productoPedido.producto?.categoria?.nombre || '',
        cantidad: productoPedido.cantidad,
      }))
    };
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto, usuarioModificacion: number): Promise<Pedido> {
    const { estado } = updatePedidoDto;
    //buscar pedido
    const pedido = await this.pedidoRepository.findOneBy({ id: id });
    if (!pedido) {
      throw new NotFoundException('No se pudo encontrar el pedido');
    }
    if (pedido.estado !== 'PENDIENTE') {
      // throw new BadRequestException('No se puede realizar el cambio de estado');
    }

    const pedidoDetalle = await this.findOne(id);
    this.clientFacturacion.emit('generar_factura', pedidoDetalle);
    
    console.log('envio de notificacion')
    this.client.emit('notify_order_status_change', { id: id, estado: estado, email: 'armando.2k6@gmail.com' });

    pedido.estado = estado;
    return await this.pedidoRepository.save(pedido);

  }

//estado atendido

async atenderPedido(id: number, usuarioModificacion: number): Promise<Pedido> {
  const pedido = await this.pedidoRepository.findOneBy({ id: id });
  if (!pedido) {
    throw new NotFoundException(`El pedido con ID ${id} no existe.`);
  }

  if (pedido.estado !== 'PENDIENTE') {
    throw new BadRequestException('Solo se puede atender pedidos en estado PENDIENTE.');
  }

  // Cambiar el estado del pedido a ATENDIDO
  pedido.estado = 'ATENDIDO';

  // Guardar el cambio en la base de datos
  const pedidoActualizado = await this.pedidoRepository.save(pedido);

  // Enviar una notificación al microservicio de notificaciones
  this.client.emit('notify_order_status_change', { 
    id: id, 
    estado: 'ATENDIDO', 
    email: 'cliente@example.com'  // Puedes personalizar este campo si tienes el correo del cliente
  });

  // Enviar la información al microservicio de facturación
  const pedidoDetalle = await this.findOne(id);
  this.clientFacturacion.emit('generar_factura', pedidoDetalle);

  return pedidoActualizado;
}

//---
  remove(id: number) {
    return `This action removes a #${id} pedido`;
  }


  async getEstado(id: number): Promise<{ estado: string }> {
    const pedido = await this.pedidoRepository.createQueryBuilder('pedido')
      .where('pedido.id = :id', { id })
      .select(['pedido.estado'])
      .getOne();

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return { estado: pedido.estado }; // Devuelve el estado del pedido
}


}
