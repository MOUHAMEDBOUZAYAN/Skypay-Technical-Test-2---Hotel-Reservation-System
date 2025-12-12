import prisma from '../config/database.js';

export const setUserService = async (userId, balance) => {
  // Validate balance
  if (balance === undefined || balance === null || balance < 0) {
    throw new Error('Balance must be a non-negative number');
  }

  // Upsert user (create if not exists, update if exists)
  const user = await prisma.user.upsert({
    where: { userId },
    update: {
      balance,
    },
    create: {
      userId,
      balance,
    },
  });

  return user;
};

export const getAllUsersService = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      userId: 'asc',
    },
    include: {
      bookings: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return users;
};

