import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding authentication users...');

  // Créer un utilisateur admin par défaut
  const adminEmail = 'admin@hotel.com';
  const adminPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.authUser.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    await prisma.authUser.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        nom: 'Admin',
        prenom: 'System',
        telephone: '+33 1 23 45 67 89',
        role: 'admin'
      }
    });
    console.log(`✅ Admin créé: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`ℹ️  Admin existe déjà: ${adminEmail}`);
  }

  // Créer un utilisateur normal par défaut
  const userEmail = 'user@hotel.com';
  const userPassword = 'user123';
  const hashedUserPassword = await bcrypt.hash(userPassword, 10);

  const existingUser = await prisma.authUser.findUnique({
    where: { email: userEmail }
  });

  if (!existingUser) {
    await prisma.authUser.create({
      data: {
        email: userEmail,
        password: hashedUserPassword,
        nom: 'User',
        prenom: 'Test',
        telephone: '+33 6 12 34 56 78',
        role: 'user'
      }
    });
    console.log(`✅ Utilisateur créé: ${userEmail} / ${userPassword}`);
  } else {
    console.log(`ℹ️  Utilisateur existe déjà: ${userEmail}`);
  }

  console.log('✨ Seeding terminé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

