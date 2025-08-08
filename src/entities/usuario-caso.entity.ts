import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Usuario } from './usuario.entity';
import { Caso } from './caso.entity';

@Entity('usuarios_casos')
@Unique(['casoId', 'usuarioId'])
export class UsuarioCaso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'caso_id' })
  casoId: number;

  @Column({ name: 'usuario_id' })
  usuarioId: number;

  @ManyToOne(() => Caso, (caso) => caso.usuariosCasos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'caso_id' })
  caso: Caso;

  @ManyToOne(() => Usuario, (usuario) => usuario.usuariosCasos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}