// Script para verificar el usuario administrador
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verificarAdmin() {
  try {
    console.log('\n🔍 Verificando usuario administrador...\n');

    const admin = await prisma.usuario.findUnique({
      where: { email: 'admin@beloop.io' },
      include: {
        empresas: {
          include: {
            empresa: true,
            roles: {
              include: {
                rol: true
              }
            }
          }
        }
      }
    });

    if (!admin) {
      console.log('❌ No se encontró el usuario administrador.\n');
      return;
    }

    console.log('✅ Usuario administrador encontrado:');
    console.log(`   ID: ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Nombre: ${admin.nombre}`);
    console.log(`   Activo: ${admin.activo ? 'Sí' : 'No'}`);
    console.log(`   Creado: ${admin.creadoEn.toLocaleString()}`);

    if (admin.empresas.length > 0) {
      console.log(`\n📊 Empresas asociadas:`);
      admin.empresas.forEach(ue => {
        console.log(`   - ${ue.empresa.nombre} ${ue.empresa.esEmpresaMaestra ? '(Empresa Maestra)' : ''}`);
        if (ue.roles.length > 0) {
          console.log(`     Roles: ${ue.roles.map(r => r.rol.nombre).join(', ')}`);
        }
      });
    }

    console.log('\n✅ El administrador está listo para hacer tests.\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verificarAdmin();
