export interface ProductoDto{
    nombre: string;
    categoria: string;
    cantidad: number;
}

export interface PedidoDto{
    id: number;
    fecha: Date;
    productos: ProductoDto[];
}