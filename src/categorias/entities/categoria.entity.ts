import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Producto } from "../../productos/entities/producto.entity";
import { BaseAuditoria } from "../../core/base-auditoria.entity";  

@Entity()
export class Categoria extends BaseAuditoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ default: "ACTIVO" })
  estado: string;

  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];
}
