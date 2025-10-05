// backend/scripts/check-admin-hash.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function run() {
  const email = (process.argv[2] ?? 'admin@beloop.io').toLowerCase();
  const pass  = process.argv[3] ?? 'Bel00per.2025';
  const pepper = process.env.PASSWORD_PEPPER;

  if (!pepper) throw new Error('PASSWORD_PEPPER no configurado');
  const u = await prisma.usuario.findUnique({ where: { email } });
  if (!u || !u.password) { console.log('Usuario no existe o sin password'); return; }

  const ok = await bcrypt.compare(`${pass}${pepper}`, u.password);
  console.log('¿Hash coincide con password+pepper actual?', ok);
  console.log('activo=', u.activo);
}
run().finally(() => prisma.$disconnect());
