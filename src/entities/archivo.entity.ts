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
import { Comentario } from './comentario.entity';

@Entity('archivos')
export class Archivo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'caso_id' })
  casoId: number;

  @Column({ name: 'comentario_id', nullable: true })
  comentarioId: number | null;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 255 })
  ruta: string;

  @Column({ length: 100 })
  tipo: string;

  @Column({ type: 'int' })
  tamano: number;

  @ManyToOne(() => Caso, (caso) => caso.archivos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'caso_id' })
  caso: Caso;

  @ManyToOne(() => Comentario, (comentario) => comentario.archivos, {
    onDelete: 'SET NULL',
    nullable: true
  })
  @JoinColumn({ name: 'comentario_id' })
  comentario: Comentario;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}