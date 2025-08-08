import {
    Injectable,
    NotFoundException,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository,  SelectQueryBuilder } from 'typeorm';
  import {
    Caso,
    EstadoCaso,
    Comentario,
    Estado,
  } from '../entities';
  import { CreateCasoDto } from '@/dto/create-caso.dto';
  import { UpdateCasoDto } from '@/dto/update-caso.dto';
  import { QueryCasosDto } from '@/dto/query-casos.dto';
  import { UpdateEstadoCasoDto } from '@/dto/update-estado-caso.dto';  
  import { CreateComentarioDto } from '@/dto/create-comentario.dto';
  
  @Injectable()
  export class CasosService {
    constructor(
      @InjectRepository(Caso)
      private casoRepository: Repository<Caso>,
      @InjectRepository(EstadoCaso)
      private estadoCasoRepository: Repository<EstadoCaso>,
      @InjectRepository(Comentario)
      private comentarioRepository: Repository<Comentario>,
      @InjectRepository(Estado)
      private estadoRepository: Repository<Estado>,
    ) {}
  
    async findAll(query: QueryCasosDto) {
      const { page = 1, limit = 10, search, categoriaId, prioridadId, asignadoA } = query;
      const skip = (page - 1) * limit;
  
      const queryBuilder: SelectQueryBuilder<Caso> = this.casoRepository
        .createQueryBuilder('caso')
        .leftJoinAndSelect('caso.creador', 'creador')
        .leftJoinAndSelect('caso.colaboradorAsignado', 'colaborador')
        .leftJoinAndSelect('caso.categoria', 'categoria')
        .leftJoinAndSelect('caso.prioridad', 'prioridad')
        .leftJoinAndSelect('caso.herramienta', 'herramienta')
        .leftJoinAndSelect('creador.empresa', 'empresa')
        .orderBy('caso.createdAt', 'DESC');
  
      // Aplicar filtros
      if (search) {
        queryBuilder.andWhere(
          '(caso.titulo LIKE :search OR caso.descripcion LIKE :search)',
          { search: `%${search}%` },
        );
      }
  
      if (categoriaId) {
        queryBuilder.andWhere('caso.categoriaId = :categoriaId', { categoriaId });
      }
  
      if (prioridadId) {
        queryBuilder.andWhere('caso.prioridadId = :prioridadId', { prioridadId });
      }
  
      if (asignadoA) {
        queryBuilder.andWhere('caso.asignadoA = :asignadoA', { asignadoA });
      }
  
      // Obtener total de registros
      const total = await queryBuilder.getCount();
  
      // Aplicar paginación
      const casos = await queryBuilder.skip(skip).take(limit).getMany();
  
      return {
        casos,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }
  
    async findOne(id: number) {
      const caso = await this.casoRepository.findOne({
        where: { id },
        relations: [
          'creador',
          'creador.empresa',
          'colaboradorAsignado',
          'categoria',
          'prioridad',
          'herramienta',
          'estados',
          'estados.estado',
          'comentarios',
          'usuariosAsociados',
        ],
        order: {
          estados: { createdAt: 'DESC' },
          comentarios: { createdAt: 'ASC' },
        },
      });
  
      if (!caso) {
        throw new NotFoundException(`Caso con ID ${id} no encontrado`);
      }
  
      return caso;
    }
  
    async create(createCasoDto: CreateCasoDto, userId: number) {
      // Crear el caso
      const caso = this.casoRepository.create({
        ...createCasoDto,
        creadoPor: userId,
      });
  
      const savedCaso = await this.casoRepository.save(caso);
  
      // Crear estado inicial
      const estadoAbierto = await this.estadoRepository.findOne({
        where: { descripcion: 'Abierto' },
      });
  
      if (estadoAbierto) {
        await this.estadoCasoRepository.save({
          casoId: savedCaso.id,
          estadoId: estadoAbierto.id,
        });
      }
  
      // Retornar caso completo
      return this.findOne(savedCaso.id);
    }
  
    async update(id: number, updateCasoDto: UpdateCasoDto) {
      const caso = await this.casoRepository.findOne({ where: { id } });
  
      if (!caso) {
        throw new NotFoundException(`Caso con ID ${id} no encontrado`);
      }
  
      await this.casoRepository.update(id, updateCasoDto);
      return this.findOne(id);
    }
  
    async remove(id: number) {
      const caso = await this.casoRepository.findOne({ where: { id } });
  
      if (!caso) {
        throw new NotFoundException(`Caso con ID ${id} no encontrado`);
      }
  
      await this.casoRepository.remove(caso);
      return { message: 'Caso eliminado exitosamente' };
    }
  
    async updateEstado(id: number, updateEstadoDto: UpdateEstadoCasoDto) {
      const caso = await this.casoRepository.findOne({ where: { id } });
  
      if (!caso) {
        throw new NotFoundException(`Caso con ID ${id} no encontrado`);
      }
  
      const estado = await this.estadoRepository.findOne({
        where: { id: updateEstadoDto.estadoId },
      });
  
      if (!estado) {
        throw new BadRequestException('Estado no válido');
      }
  
      const estadoCaso = this.estadoCasoRepository.create({
        casoId: id,
        estadoId: updateEstadoDto.estadoId,
      });
  
      await this.estadoCasoRepository.save(estadoCaso);
  
      return { message: 'Estado del caso actualizado exitosamente' };
    }
  
    async addComentario(id: number, createComentarioDto: CreateComentarioDto) {
      const caso = await this.casoRepository.findOne({ where: { id } });
  
      if (!caso) {
        throw new NotFoundException(`Caso con ID ${id} no encontrado`);
      }
  
      const comentario = this.comentarioRepository.create({
        ...createComentarioDto,
        casoId: id,
      });
  
      const savedComentario = await this.comentarioRepository.save(comentario);
  
      return {
        message: 'Comentario agregado exitosamente',
        comentario: savedComentario,
      };
    }
  
    async getEstadisticas() {
      const totalCasos = await this.casoRepository.count();
      
      const casosPorEstado = await this.casoRepository
        .createQueryBuilder('caso')
        .leftJoin('caso.estados', 'estadoCaso')
        .leftJoin('estadoCaso.estado', 'estado')
        .select('estado.descripcion', 'estado')
        .addSelect('COUNT(DISTINCT caso.id)', 'cantidad')
        .groupBy('estado.descripcion')
        .getRawMany();
  
      const casosPorPrioridad = await this.casoRepository
        .createQueryBuilder('caso')
        .leftJoin('caso.prioridad', 'prioridad')
        .select('prioridad.descripcion', 'prioridad')
        .addSelect('COUNT(caso.id)', 'cantidad')
        .groupBy('prioridad.descripcion')
        .getRawMany();
  
      const casosPorCategoria = await this.casoRepository
        .createQueryBuilder('caso')
        .leftJoin('caso.categoria', 'categoria')
        .select('categoria.descripcion', 'categoria')
        .addSelect('COUNT(caso.id)', 'cantidad')
        .groupBy('categoria.descripcion')
        .getRawMany();
  
      return {
        totalCasos,
        casosPorEstado,
        casosPorPrioridad,
        casosPorCategoria,
      };
    }
  }
  