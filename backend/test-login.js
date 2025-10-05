// Script para probar el login del administrador
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testLogin() {
  try {
    const email = 'admin@beloop.io';
    const password = 'Bel00per.2025';

    console.log('\n🔐 Probando login del administrador...\n');

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log('✅ Usuario encontrado:');
    console.log(`   Email: ${usuario.email}`);
    console.log(`   Activo: ${usuario.activo}`);
    console.log(`   Hash guardado: ${usuario.password.substring(0, 20)}...`);

    const pepper = '3steD1aImpl3m3nt4m0sO4uth**0010010101';
    if (!pepper) {
      console.log('❌ PASSWORD_PEPPER no configurado en .env');
      return;
    }

    console.log(`\n🔑 PASSWORD_PEPPER encontrado: ${pepper.substring(0, 10)}...`);

    const payload = `${password}${pepper}`;
    console.log(`\n🔐 Probando comparación de hash...`);

    const passwordOk = await bcrypt.compare(payload, usuario.password);

    if (passwordOk) {
      console.log('✅ ¡Login exitoso! Las credenciales coinciden.\n');
    } else {
      console.log('❌ Login fallido. Las credenciales NO coinciden.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
