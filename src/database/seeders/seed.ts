import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  Empresa,  
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
    //const colaboradorRepo = app.get<Repository<Colaborador>>(getRepositoryToken(Colaborador));
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
      { nombre: 'Digital Innovations' },
    ]);
    console.log('✅ Empresas creadas');    

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
       { descripcion: 'Baja', color: '#FFBF00' },   
      { descripcion: 'Media', color: '#E25822' },  
      { descripcion: 'Alta', color: '#FF4F00' },   
      { descripcion: 'Crítica', color: '#ED2939' },
      { descripcion: 'Urgente', color: '#FE0000' } 
    ]);
    console.log('✅ Prioridades creadas');

    // Crear Estados
    await estadoRepo.save([
     { descripcion: 'Abierto', color: '#00FFFF' },     
      { descripcion: 'En Progreso', color: '#00FFBF' }, 
      { descripcion: 'En Revisión', color: '#03C03C' }, 
      { descripcion: 'Testing', color: '#004953' },     
      { descripcion: 'Resuelto', color: '#39FF14' },    
      { descripcion: 'Cerrado', color: '#DA2C43' },     
      { descripcion: 'Cancelado', color: '#FF2400' }    
    ]);
    console.log('✅ Estados creados');

    // Crear Herramientas
    await herramientaRepo.save([
      { nombre: 'Aduanas' },
      { nombre: 'Facturación Electrónica' },
      { nombre: 'Courier y Transporte' },
      { nombre: 'Integraciones' },
      { nombre: 'Auditorias' },
      { nombre: 'Servicios en la Nube' },
      { nombre: 'Otros' },      
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

    const user = usuarioRepo.create({
      nombre: 'Usuario',
      correo: 'user@demo.com',
      clave: 'user123',
      empresaId: empresas[0].id,
      rol: 'usuario',
    })

    await usuarioRepo.save(user);
  
    console.log('✅ Usuarios de prueba creados');

    console.log('🎉 Seed completado exitosamente!');
    console.log('\n📧 Usuarios de prueba:');
    console.log('👨‍💼 Administrador: admin@demo.com / admin123');
    console.log('👤 Usuario: user@demo.com / user123');    

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