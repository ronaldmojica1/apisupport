import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { UpdateUsuarioDto } from '@/dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async findAll() {
    return this.usuarioRepository.find({
      relations: ['empresa'],
      select: ['id', 'nombre', 'correo', 'empresaId', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['empresa', 'casosCreados'],
      select: ['id', 'nombre', 'correo', 'empresaId', 'createdAt', 'updatedAt','rol'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.usuarioRepository.update(id, updateUsuarioDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.usuarioRepository.remove(usuario);
    return { message: 'Usuario eliminado exitosamente' };
  }

  async getProfile(userId: number) {
    return this.findOne(userId);
  }

  async getColaboradores() {
    return this.usuarioRepository.find({
      where: { rol: 'soporte' },
      relations: ['empresa'],
      select: ['id', 'nombre', 'correo', 'empresaId', 'createdAt', 'updatedAt'],
    });
  }
}
