import { Injectable, NotFoundException, BadRequestException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Paginacion } from 'src/common/paginacion';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { UploadProductoImagenDto } from './dto/upload-producto-imagen.dto';
import { FileService } from 'src/common/file.service';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,

    private fileService: FileService,
  ) { }

  async create(createProductoDto: CreateProductoDto, usuarioCreacion: number): Promise<Producto> {
    const categoria = await this.categoriaRepository.findOneBy({ id: createProductoDto.idCategoria });
    if (!categoria) {
      throw new NotFoundException(`La categoría con ID ${createProductoDto.idCategoria} no existe.`);
    }
    const producto = this.productoRepository.create({ ...createProductoDto, categoria, idUsuarioCreacion: usuarioCreacion })
    return this.productoRepository.save(producto)
  }

  async uploadImagen(id: number, uploadProductoImagen: UploadProductoImagenDto, usuarioModificacion: number){
    const producto = await this.productoRepository.findOneBy({id});
    if (!producto){
      throw new NotFoundException('El producto no esta disponible')
    }

    producto.imagen = await this.fileService.save(uploadProductoImagen.imagen, uploadProductoImagen.nombre);
    return await this.productoRepository.save(producto);
  }

  async findAll(pagina: number): Promise<Paginacion<{ nombre: string; precio: number }>> {
    const queryBuilder = this.productoRepository.createQueryBuilder('producto')
      .select(['producto.nombre', 'producto.precio'])
      .skip((pagina - 1) * 4)
      .take(4);

    const [productos, total] = await queryBuilder.getManyAndCount();
    return {
      datos: productos,
      total: total
    }
  }

 /* findOne(id: number) {
    console.log("jkashdkj");
    return `This action returns a #${id} producto`;
  }
*/

async findOne(id: number): Promise<Producto> {
  const producto = await this.productoRepository.findOneBy({ id });

  if (!producto) {
    throw new NotFoundException(`El producto con ID ${id} no fue encontrado.`);
  }

  return producto;
}


  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    await this.productoRepository.update(id, updateProductoDto)
    return this.productoRepository.findOneBy({ id })
  }

  async remove(id: number): Promise<void> {
    // Verificar si el producto existe
    const producto = await this.productoRepository.findOneBy({ id });
    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no existe.`);
    }
  
    // Eliminar producto
    await this.productoRepository.remove(producto);
  }
  //listar todos los productos
  async findAllProductos(): Promise<Producto[]> {
    return await this.productoRepository.find();
  }

  // listar los productos activos según el campo estado
  async findActiveProductos(): Promise<Producto[]> {
    return await this.productoRepository.find({ where: { estado: 'ACTIVO' } });
  }
  //cambiar estado ACTIVO/INACTIVO
  async changeEstado(id: number, nuevoEstado: string): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ id });
    
    if (!producto) {
      throw new NotFoundException(`El producto con ID ${id} no existe.`);
    }

    // Validar que el nuevo estado sea válido
    const estadosPermitidos = ['ACTIVO', 'INACTIVO'];
    if (!estadosPermitidos.includes(nuevoEstado)) {
      throw new BadRequestException(`El estado '${nuevoEstado}' no es válido. Debe ser 'ACTIVO' o 'INACTIVO'.`);
    }

    producto.estado = nuevoEstado;
    return await this.productoRepository.save(producto);
  }
 


}
