import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ProductoPedido } from './producto-pedido.entity';
import { BaseAuditoria } from 'src/core/base-auditoria.entity';

@Entity()
export class Pedido  extends BaseAuditoria{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fecha: Date;

    @Column({ default: "PENDIENTE"}) //PENDIENTE, ATENDIDO, RECHAZADO
    estado: string

    @OneToMany(() => ProductoPedido, (productoPedido) => productoPedido.pedido, { cascade: true})
    productos: ProductoPedido[];
}
