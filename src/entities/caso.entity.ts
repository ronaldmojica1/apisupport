import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  //ManyToMany,
  JoinColumn,  
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from './usuario.entity';
//import { Colaborador } from './colaborador.entity';
import { Categoria } from './categoria.entity';
import { Prioridad } from './prioridad.entity';
import { Herramienta } from './herramienta.entity';
import { EstadoCaso } from './estado-caso.entity';
import { Comentario } from './comentario.entity';
import { UsuarioCaso } from './usuario-caso.entity';
import { Estado } from './estado.entity';
import { Archivo } from './archivo.entity';

@Entity('casos')
export class Caso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'creado_por' })
  creadoPor: number;

  @Column({ name: 'asignado_a', nullable: true })
  asignadoA?: number;

  @Column({ length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ name: 'categoria_id' })
  categoriaId: number;

  @Column({ name: 'herramienta_id', nullable: true })
  herramientaId?: number;

  @Column({ name: 'prioridad_id' })
  prioridadId: number;

  @Column({ name: 'estado_id', nullable: true })
  estadoId?: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.casosCreados, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creado_por' })
  creador: Usuario;

  @ManyToOne(() => Usuario, (colaborador) => colaborador.casosAsignados, {
    nullable: true,
  })
  @JoinColumn({ name: 'asignado_a' })
  colaboradorAsignado?: Usuario;

  @ManyToOne(() => Categoria, (categoria) => categoria.casos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @ManyToOne(() => Estado, (estado) => estado.casos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'estado_id' })
  estado?: Estado;

  @ManyToOne(() => Prioridad, (prioridad) => prioridad.casos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prioridad_id' })
  prioridad: Prioridad;

  @ManyToOne(() => Herramienta, (herramienta) => herramienta.casos, {
    nullable: true,
  })
  @JoinColumn({ name: 'herramienta_id' })
  herramienta?: Herramienta;

  @OneToMany(() => EstadoCaso, (estadoCaso) => estadoCaso.caso, {
    cascade: true,
  })
  estados: EstadoCaso[];

  @OneToMany(() => Comentario, (comentario) => comentario.caso, {
    cascade: true,
  })
  comentarios: Comentario[];

  @OneToMany(() => UsuarioCaso, (usuarioCaso) => usuarioCaso.caso)
  usuariosCasos: UsuarioCaso[];

  @OneToMany(() => Archivo, (archivo) => archivo.caso, {
    cascade: true,
  })
  archivos: Archivo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}