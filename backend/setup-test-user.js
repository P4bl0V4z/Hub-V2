// Script para crear usuario de prueba
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupTestUser() {
  try {
    console.log('\n🔍 Verificando usuario de prueba...\n');

    // Buscar usuario con id 1
    let user = await prisma.usuario.findUnique({
      where: { id: 1 }
    });

    if (user) {
      console.log('✅ Usuario de prueba ya existe:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.nombre}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Activo: ${user.activo}`);
    } else {
      console.log('❌ Usuario con ID 1 no existe. Creando...\n');

      user = await prisma.usuario.create({
        data: {
          email: 'test@beloop.io',
          nombre: 'Usuario de Prueba',
          activo: true,
          password: '$2b$10$dummyHashForTestUser',
        }
      });

      console.log('✅ Usuario de prueba creado exitosamente:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.nombre}`);
      console.log(`   Email: ${user.email}`);
    }

    console.log('\n✅ Configuración completada. Ya puedes hacer las pruebas del test.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

setupTestUser();
