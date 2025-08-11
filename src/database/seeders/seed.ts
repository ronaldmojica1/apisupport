import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Empresa,
  Colaborador,
  Categoria,
  Prioridad,
  Estado,
  Herramienta,
  Usuario,
} from '../../entities';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    console.log('🌱 Iniciando seed de datos...');

    // Obtener repositorios
    const empresaRepo = app.get<Repository<Empresa>>(getRepositoryToken(Empresa));
    const colaboradorRepo = app.get<Repository<Colaborador>>(getRepositoryToken(Colaborador));
    const categoriaRepo = app.get<Repository<Categoria>>(getRepositoryToken(Categoria));
    const prioridadRepo = app.get<Repository<Prioridad>>(getRepositoryToken(Prioridad));
    const estadoRepo = app.get<Repository<Estado>>(getRepositoryToken(Estado));
    const herramientaRepo = app.get<Repository<Herramienta>>(getRepositoryToken(Herramienta));
    const usuarioRepo = app.get<Repository<Usuario>>(getRepositoryToken(Usuario));

    // Limpiar datos existentes
    //await usuarioRepo.clear().then();
    //await empresaRepo.clear();
    //await colaboradorRepo.clear();
    //await categoriaRepo.clear();
    //await prioridadRepo.clear();
    //await estadoRepo.clear();
    //await herramientaRepo.clear();

    // Crear Empresas
    const empresas = await empresaRepo.save([
      { nombre: 'TechCorp Solutions' },
      { nombre: 'Digital Innovations' },
      { nombre: 'Software Development Co.' },
    ]);
    console.log('✅ Empresas creadas');

    // Crear Colaboradores
    await colaboradorRepo.save([
      { nombre: 'Juan Pérez - Desarrollador Senior' },
      { nombre: 'María García - QA Lead' },
      { nombre: 'Carlos López - DevOps Engineer' },
      { nombre: 'Ana Rodríguez - Product Manager' },
      { nombre: 'Luis Martín - UI/UX Designer' },
    ]);
    console.log('✅ Colaboradores creados');

    // Crear Categorías
    await categoriaRepo.save([
      { descripcion: 'Bug/Error' },
      { descripcion: 'Nueva Funcionalidad' },
      { descripcion: 'Mejora de Performance' },
      { descripcion: 'Soporte Técnico' },
      { descripcion: 'Consulta General' },
      { descripcion: 'Refactoring' },
    ]);
    console.log('✅ Categorías creadas');

    // Crear Prioridades
    await prioridadRepo.save([
      { descripcion: 'Baja' },
      { descripcion: 'Media' },
      { descripcion: 'Alta' },
      { descripcion: 'Crítica' },
      { descripcion: 'Urgente' },
    ]);
    console.log('✅ Prioridades creadas');

    // Crear Estados
    await estadoRepo.save([
      { descripcion: 'Abierto' },
      { descripcion: 'En Progreso' },
      { descripcion: 'En Revisión' },
      { descripcion: 'Testing' },
      { descripcion: 'Resuelto' },
      { descripcion: 'Cerrado' },
      { descripcion: 'Cancelado' },
      { descripcion: 'Bloqueado' },
    ]);
    console.log('✅ Estados creados');

    // Crear Herramientas
    await herramientaRepo.save([
      { nombre: 'Visual Studio Code' },
      { nombre: 'IntelliJ IDEA' },
      { nombre: 'Git' },
      { nombre: 'Docker' },
      { nombre: 'Postman' },
      { nombre: 'MySQL Workbench' },
      { nombre: 'Jira' },
      { nombre: 'Slack' },
      { nombre: 'Figma' },
      { nombre: 'Jenkins' },
    ]);
    console.log('✅ Herramientas creadas');

    // Crear Usuarios de prueba
    const admin = usuarioRepo.create({
      nombre: 'Administrador',
      correo: 'admin@demo.com',
      clave: 'admin123',
      //empresaId: empresas[0].id,
      rol: 'soporte',
    });

    await usuarioRepo.save(admin);  
  
    console.log('✅ Usuarios de prueba creados');

    console.log('🎉 Seed completado exitosamente!');
    console.log('\n📧 Usuarios de prueba:');
    console.log('👨‍💼 Administrador: admin@demo.com / admin123');
    console.log('👤 Usuario: user@demo.com / user123');
    console.log('👨‍💼 Manager: manager@demo.com / manager123');

  } catch (error) {
    console.error('❌ Error en el seed:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Ejecutar seed si es llamado directamente
if (require.main === module) {
  seed().catch((error) => {
    console.error('Error ejecutando seed:', error);
    process.exit(1);
  });
}

export { seed };