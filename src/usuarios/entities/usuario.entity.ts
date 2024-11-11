import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  usuario: string;

  @Column({ unique: true })
  correo: string;

  @Column()
  clave: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];
}
