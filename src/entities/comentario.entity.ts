import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Caso } from './caso.entity';
import { Usuario } from './usuario.entity';
import { Archivo } from './archivo.entity';

@Entity('comentarios')
export class Comentario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'caso_id' })
  casoId: number;

  @Column({ type: 'text' })
  comentario: string;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.comentarios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Caso, (caso) => caso.comentarios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'caso_id' })
  caso: Caso;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Archivo, (archivo) => archivo.comentario)
  archivos: Archivo[];
}