import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Empresa } from './empresa.entity';
import { Caso } from './caso.entity';
import { UsuarioCaso } from './usuario-caso.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ length: 255, unique: true })
  correo: string;

  @Column({ length: 255, select: false })
  clave: string;

  @Column({ name: 'empresa_id' })
  empresaId: number;

  @ManyToOne(() => Empresa, (empresa) => empresa.usuarios, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @OneToMany(() => Caso, (caso) => caso.creador)
  casosCreados: Caso[];

  @ManyToMany(() => Caso, (caso) => caso.usuariosAsociados)
  casosAsociados: Caso[];

  @OneToMany(() => UsuarioCaso, (usuarioCaso) => usuarioCaso.usuario)
  usuariosCasos: UsuarioCaso[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.clave) {
      this.clave = await bcrypt.hash(this.clave, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.clave);
  }
}