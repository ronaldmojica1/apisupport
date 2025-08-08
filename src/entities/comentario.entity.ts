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

@Entity('comentarios')
export class Comentario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'caso_id' })
  casoId: number;

  @Column({ type: 'text' })
  comentario: string;

  @ManyToOne(() => Caso, (caso) => caso.comentarios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'caso_id' })
  caso: Caso;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}