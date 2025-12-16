import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const registerService = async (email, password, nom, prenom, telephone, role = 'user') => {
  // Vérifier si l'utilisateur existe déjà
  const existingUser = await prisma.authUser.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existingUser) {
    throw new Error('Cet email est déjà utilisé');
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer l'utilisateur
  const user = await prisma.authUser.create({
    data: {
      email: email.toLowerCase(),
      password: hashedPassword,
      nom: nom,
      prenom: prenom,
      telephone: telephone || null,
      role: role
    },
    select: {
      id: true,
      email: true,
      nom: true,
      prenom: true,
      telephone: true,
      role: true,
      createdAt: true
    }
  });

  return user;
};

export const loginService = async (email, password) => {
  // Trouver l'utilisateur
  const user = await prisma.authUser.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (!user) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // Vérifier le mot de passe
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error('Email ou mot de passe incorrect');
  }

  // Générer le token JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      telephone: user.telephone,
      role: user.role
    },
    token
  };
};

export const getCurrentUserService = async (userId) => {
  const user = await prisma.authUser.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      nom: true,
      prenom: true,
      telephone: true,
      role: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }

  return user;
};

