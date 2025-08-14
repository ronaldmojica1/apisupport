import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EstadoCaso } from './estado-caso.entity';
import { Caso } from './caso.entity';

@Entity('estados')
export class Estado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  descripcion: string;

  @Column({ length: 255 })
  color: string;

  @OneToMany(() => EstadoCaso, (estadoCaso) => estadoCaso.estado)
  estadosCaso: EstadoCaso[];

  @OneToMany(() => Caso, (caso) => caso.estado)
  casos: Caso[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}