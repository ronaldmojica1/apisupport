import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Caso } from './caso.entity';
import { Estado } from './estado.entity';
import { Usuario } from './usuario.entity';

@Entity('estados_casos')
export class EstadoCaso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'caso_id' })
  casoId: number;

  @Column({ name: 'estado_id' })
  estadoId: number;

  @Column({ name: 'usuario_id', nullable: true })
  usuarioId: number;

  @ManyToOne(() => Caso, (caso) => caso.estados, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'caso_id' })
  caso: Caso;

  @ManyToOne(() => Estado, (estado) => estado.estadosCaso, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'estado_id' })
  estado: Estado;

  @ManyToOne(() => Usuario, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}