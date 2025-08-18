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
    Archivo,
  } from '../entities';
  import * as fs from 'fs';
  import * as path from 'path';
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
      @InjectRepository(Archivo)
      private archivoRepository: Repository<Archivo>,
    ) {}
    
    private readonly uploadDir = path.join(process.cwd(), 'uploads');
  
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
        .leftJoinAndSelect('caso.estado', 'estado')
        .where('caso.archivar = :archivar', { archivar: false })
        .orderBy('caso.createdAt', 'ASC');
  
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
    
    async findAllByUserId(userId: number, query: QueryCasosDto) {
      const { page = 1, limit = 10, search } = query;
      const skip = (page - 1) * limit;  
      const queryBuilder: SelectQueryBuilder<Caso> = this.casoRepository
        .createQueryBuilder('caso')
        .leftJoinAndSelect('caso.creador', 'creador')
        .leftJoinAndSelect('caso.colaboradorAsignado', 'colaborador')
        .leftJoinAndSelect('caso.categoria', 'categoria')
        .leftJoinAndSelect('caso.prioridad', 'prioridad')
        .leftJoinAndSelect('caso.herramienta', 'herramienta')
        .leftJoinAndSelect('creador.empresa', 'empresa')
        .leftJoinAndSelect('caso.estado', 'estado')
        .where('(caso.creadoPor = :userId OR caso.asignadoA = :userId) AND caso.archivar = :archivar', { userId, archivar: false })
        .orderBy('caso.createdAt', 'ASC'); 
      // Aplicar filtro de búsqueda
      if (search) {
        queryBuilder.andWhere(
          '(caso.titulo LIKE :search OR caso.descripcion LIKE :search)',
          { search: `%${search}%` },
        );
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

    async findAllByEmpresaId(empresaId: number, query: QueryCasosDto) {
      const { page = 1, limit = 10, search } = query;
      const skip = (page - 1) * limit;

      const queryBuilder: SelectQueryBuilder<Caso> = this.casoRepository
        .createQueryBuilder('caso')
        .leftJoinAndSelect('caso.creador', 'creador')
        .leftJoinAndSelect('caso.colaboradorAsignado', 'colaborador')
        .leftJoinAndSelect('caso.categoria', 'categoria')
        .leftJoinAndSelect('caso.prioridad', 'prioridad')
        .leftJoinAndSelect('caso.herramienta', 'herramienta')
        .leftJoinAndSelect('creador.empresa', 'empresa')
        .leftJoinAndSelect('caso.estado', 'estado')
        .where('empresa.id = :empresaId AND caso.archivar = :archivar', { empresaId, archivar: false })
        .orderBy('caso.createdAt', 'ASC');

      // Aplicar filtro de búsqueda
      if (search) {
        queryBuilder.andWhere(
          '(caso.titulo LIKE :search OR caso.descripcion LIKE :search)',
          { search: `%${search}%` },
        );
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
          'estados.usuario',
          'estado',
          'comentarios',
          'comentarios.usuario',
          'comentarios.archivos',
          'archivos',
        ],
        order: {
          estados: { createdAt: 'DESC' },
          comentarios: { createdAt: 'DESC' },
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
        // Actualizar el campo estadoId en la tabla de casos
        await this.casoRepository.update(savedCaso.id, {
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
  
    async updateEstado(id: number, updateEstadoDto: UpdateEstadoCasoDto, userId: number) {
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

    const estadoCaso = this.estadoCasoRepository.create(<EstadoCaso>{
      casoId: id,
      estadoId: updateEstadoDto.estadoId,
      usuarioId: userId,
    });

    await this.estadoCasoRepository.save(estadoCaso);

    // Actualizar el campo estadoId en la tabla de casos
    await this.casoRepository.update(id, {
      estadoId: updateEstadoDto.estadoId,
    });

    return { message: 'Estado del caso actualizado exitosamente' };
    }
  
    async addComentario(id: number, createComentarioDto: CreateComentarioDto, userId: number) {

    const caso = await this.casoRepository.findOne({ where: { id } });

    if (!caso) {
      throw new NotFoundException(`Caso con ID ${id} no encontrado`);
    }

    const comentario = this.comentarioRepository.create({
      ...createComentarioDto,
      usuarioId: userId,
      casoId: id,
    });

    const savedComentario = await this.comentarioRepository.save(comentario);

    // Si hay archivos para vincular al comentario
    if (createComentarioDto.archivosIds && createComentarioDto.archivosIds.length > 0) {
      // Actualizar los archivos para vincularlos al comentario
      await Promise.all(
        createComentarioDto.archivosIds.map(async (archivoId) => {
          const archivo = await this.archivoRepository.findOne({ where: { id: archivoId, casoId: id } });
          if (archivo) {
            archivo.comentarioId = savedComentario.id;
            await this.archivoRepository.save(archivo);
          }
        })
      );
    }

    return savedComentario;
  
    }
  
    async getEstadisticas() {
      const totalCasos = await this.casoRepository.count({ where: { archivar: false } });
      
      const casosPorEstado = await this.casoRepository
        .createQueryBuilder('caso')
        .leftJoin('caso.estado', 'estado')
        //.leftJoin('estadoCaso.estado', 'estado')
        .select('estado.descripcion', 'estado')
        .addSelect('COUNT(caso.id)', 'cantidad')
        .where('caso.archivar = :archivar', { archivar: false })
        .groupBy('estado.descripcion')
        .getRawMany();
  
      const casosPorPrioridad = await this.casoRepository
        .createQueryBuilder('caso')
        .leftJoin('caso.prioridad', 'prioridad')
        .select('prioridad.descripcion', 'prioridad')
        .addSelect('COUNT(caso.id)', 'cantidad')
        .where('caso.archivar = :archivar', { archivar: false })
        .groupBy('prioridad.descripcion')
        .getRawMany();
  
      const casosPorCategoria = await this.casoRepository
        .createQueryBuilder('caso')
        .leftJoin('caso.categoria', 'categoria')
        .select('categoria.descripcion', 'categoria')
        .addSelect('COUNT(caso.id)', 'cantidad')
        .where('caso.archivar = :archivar', { archivar: false })
        .groupBy('categoria.descripcion')
        .getRawMany();
  
      return {
        totalCasos,
        casosPorEstado,
        casosPorPrioridad,
        casosPorCategoria,
      };
    }

    async uploadArchivo(casoId: number, file: Express.Multer.File, comentarioId?: number) {
    const caso = await this.findOne(casoId);
    if (!caso) {
      throw new NotFoundException(`Caso con ID ${casoId} no encontrado`);
    }

    // Verificar el comentario si se proporciona un ID
    if (comentarioId) {
      const comentario = await this.comentarioRepository.findOne({ 
        where: { id: comentarioId, casoId } 
      });
      
      if (!comentario) {
        throw new NotFoundException(`Comentario con ID ${comentarioId} no encontrado para este caso`);
      }
    }

    // Con Multer configurado, el archivo ya se ha guardado físicamente
    // Solo necesitamos crear el registro en la base de datos
    const archivo = this.archivoRepository.create({
      casoId,
      comentarioId: comentarioId || null,
      nombre: file.originalname,
      ruta: file.path.replace(/\\/g, '/').replace('uploads/', ''),
      tipo: file.mimetype,
      tamano: file.size,
    });

    await this.archivoRepository.save(archivo);
    return archivo;
    }

    async getArchivos(casoId: number, comentarioId?: number) {
    const caso = await this.findOne(casoId);
    if (!caso) {
      throw new NotFoundException(`Caso con ID ${casoId} no encontrado`);
    }

    const whereCondition: any = { casoId };
    
    // Si se proporciona un ID de comentario, filtrar por ese comentario
    if (comentarioId) {
      whereCondition.comentarioId = comentarioId;
    }

    return this.archivoRepository.find({      
      where: whereCondition,
      order: { createdAt: 'DESC' },
      relations: ['comentario']
    });
    }

    async getArchivo(id: number) {
      const archivo = await this.archivoRepository.findOne({
        where: { id },
      });

      if (!archivo) {
        throw new NotFoundException(`Archivo con ID ${id} no encontrado`);
      }

      return archivo;
    }

    async deleteArchivo(id: number) {
      const archivo = await this.getArchivo(id);
      
      try {
        // Eliminar archivo físico
        const filePath = path.join(this.uploadDir, archivo.ruta);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // Eliminar registro de la base de datos
        await this.archivoRepository.remove(archivo);
        return { message: 'Archivo eliminado correctamente' };
      } catch (error) {
        throw new BadRequestException(`Error al eliminar el archivo: ${error.message}`);
      }
    }

    async archivarCaso(id: number) {
      const caso = await this.casoRepository.findOne({ where: { id } });
  
      if (!caso) {
        throw new NotFoundException(`Caso con ID ${id} no encontrado`);
      }
  
      await this.casoRepository.update(id, { archivar: true });
      return { message: 'Caso archivado exitosamente' };
    }

    async desarchivarCaso(id: number) {
      const caso = await this.casoRepository.findOne({ where: { id } });
  
      if (!caso) {
        throw new NotFoundException(`Caso con ID ${id} no encontrado`);
      }
  
      await this.casoRepository.update(id, { archivar: false });
      return { message: 'Caso desarchivado exitosamente' };
    }
  }
  