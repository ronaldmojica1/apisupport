import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoCaso } from './estado-caso.entity';

@Entity('estados')
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  descripcion: string;

  @OneToMany(() => EstadoCaso, (estadoCaso) => estadoCaso.estado)
  estadosCaso: EstadoCaso[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}