import { Request, Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Sesion } from 'src/auth/sesion.decorator';
import { UploadProductoImagenDto } from './dto/upload-producto-imagen.dto';
import { session } from 'passport';

@ApiTags('productos')

@UseGuards(JwtGuard, RolesGuard)
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @ApiOperation({ summary: 'Crear Producto'})
  @ApiResponse({ status: 200, description: 'Producto creado exitosamente'})
  @ApiResponse({ status: 404, description: 'La categoria del producto no fue encontrada'})
 
  @Post()
  @Roles(['ADMIN'])
  create(
    @Sesion() sesion,
    @Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto, sesion.id);
  }

  @ApiOperation({ summary: 'subir imagen'})
  @ApiResponse({ status: 200, description: 'imagen cargada exitosamente'})
  @ApiResponse({ status: 404, description: 'error de imagen'})

  @Post(':id/imagen')
  @Roles(['ADMIN'])
  upload(
    @Param('id') id: string,
    @Sesion() sesion,
    @Body() uploadProductoImagen: UploadProductoImagenDto
  ){
    return this.productosService.uploadImagen(+id, uploadProductoImagen, sesion.id);
  }

  @ApiOperation({ summary: 'listar productos'})
  @ApiResponse({ status: 200, description: 'lista de productos'})
 
  @Get()
  @Roles(['ADMIN', 'USUARIO'])
  findAll(
    @Query('pagina') pagina: number = 1,
  ) {
    return this.productosService.findAll(pagina);
  }
  @ApiOperation({ summary: 'listar productos por ID'})
  @ApiResponse({ status: 200, description: 'detalle de producto'})
  @ApiResponse({ status: 404, description: 'no encontrado'})
  @Get(':id')
  @Roles(['ADMIN', 'USUARIO'])
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }

  @ApiOperation({ summary: 'actualizar producto'})
  @ApiResponse({ status: 200, description: 'producto actualizado'})
  @ApiResponse({ status: 404, description: 'id no encontrado'})

  @Patch(':id')
  @Roles(['ADMIN'])
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(+id, updateProductoDto);
  }

  @ApiOperation({ summary: 'eliminar producto'})
  @ApiResponse({ status: 204, description: 'producto eliminado exitosamente'})
  @ApiResponse({ status: 404, description: 'el producto no existe'})

  @Delete(':id')
  @Roles(['ADMIN'])
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }

  @ApiOperation({ summary: 'listar productos'})
  @ApiResponse({ status: 200, description: 'listar todos productos'})

  @Get('todos')
  @Roles(['ADMIN', 'USUARIO'])
  findAllProductos() {
    return this.productosService.findAllProductos();
  }

  @ApiOperation({ summary: 'listar productos activos'})
  @ApiResponse({ status: 200, description: 'listar solo productos con estado ACTIVO'})
  @Get('activos')
  @Roles(['ADMIN', 'USUARIO'])
  findActiveProductos() {
    return this.productosService.findActiveProductos();
  }

  @ApiOperation({ summary: 'actualizar estado de producto'})
  @ApiResponse({ status: 200, description: 'estado actualizado'})
  @ApiResponse({ status: 404, description: 'id no encontrado'})

  @Patch(':id/estado')
  @Roles(['ADMIN'])
  changeEstado(
    @Param('id') id: string, 
    @Body('estado') estado: string
  ) {
    return this.productosService.changeEstado(+id, estado);
  }

}
