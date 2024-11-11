import { Column } from "typeorm";

export abstract class BaseAuditoria {
  @Column({ type: 'int', nullable: true })
  idUsuarioCreacion: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ type: 'int', nullable: true })
  idUsuarioModificacion: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaModificacion: Date;
}
