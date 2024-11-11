import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "src/productos/entities/producto.entity";
import { Pedido } from "./pedido.entity";

@Entity()
export class ProductoPedido{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cantidad: number;

    @ManyToOne(()=> Pedido, (pedido) => pedido.productos)
    pedido: Pedido

    @ManyToOne(() => Producto)
    producto: Producto;

}