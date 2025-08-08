import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Empresa,
  Colaborador,
  Categoria,
  Prioridad,
  Estado,
  Herramienta,
} from '../entities';

@Injectable()
export class CatalogsService {
  constructor(
    @InjectRepository(Empresa)
    private empresaRepository: Repository<Empresa>,
    @InjectRepository(Colaborador)
    private colaboradorRepository: Repository<Colaborador>,
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
    @InjectRepository(Prioridad)
    private prioridadRepository: Repository<Prioridad>,
    @InjectRepository(Estado)
    private estadoRepository: Repository<Estado>,
    @InjectRepository(Herramienta)
    private herramientaRepository: Repository<Herramienta>,
  ) {}

  async getEmpresas() {
    return this.empresaRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async getColaboradores() {
    return this.colaboradorRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async getCategorias() {
    return this.categoriaRepository.find({
      order: { descripcion: 'ASC' },
    });
  }

  async getPrioridades() {
    return this.prioridadRepository.find({
      order: { id: 'ASC' },
    });
  }

  async getEstados() {
    return this.estadoRepository.find({
      order: { id: 'ASC' },
    });
  }

  async getHerramientas() {
    return this.herramientaRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async getAllCatalogs() {
    const [empresas, colaboradores, categorias, prioridades, estados, herramientas] =
      await Promise.all([
        this.getEmpresas(),
        this.getColaboradores(),
        this.getCategorias(),
        this.getPrioridades(),
        this.getEstados(),
        this.getHerramientas(),
      ]);

    return {
      empresas,
      colaboradores,
      categorias,
      prioridades,
      estados,
      herramientas,
    };
  }
}