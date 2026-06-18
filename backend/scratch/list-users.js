import prisma from '../src/config/prisma.js';

const run = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
    console.log('Registered Users:', JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    await prisma.$disconnect();
  }
};

run();
