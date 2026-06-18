import prisma from '../../config/prisma.js';

/**
 * Adds a new active session refresh token to the database list
 * @param {string} userId UUID
 * @param {string} refreshToken 
 * @param {Date} expiresAt 
 */
export const createSession = async (userId, refreshToken, expiresAt) => {
  const session = await prisma.session.create({
    data: {
      userId,
      refreshToken,
      expiresAt,
    },
    select: {
      id: true,
      userId: true,
      refreshToken: true,
      expiresAt: true,
    },
  });

  return {
    id: session.id,
    user_id: session.userId,
    refresh_token: session.refreshToken,
    expires_at: session.expiresAt,
  };
};

/**
 * Finds user details associated with a specific active refresh token from the sessions table
 * @param {string} refreshToken 
 */
export const findSessionWithUser = async (refreshToken) => {
  const session = await prisma.session.findUnique({
    where: { refreshToken },
    include: {
      user: true,
    },
  });

  if (!session || session.expiresAt < new Date()) {
    return null;
  }

  // Contract: returns user details directly
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    refresh_token: session.refreshToken,
    expires_at: session.expiresAt,
  };
};

/**
 * Rotates an active refresh token string for a session
 * @param {string} oldToken 
 * @param {string} newToken 
 * @param {Date} expiresAt 
 */
export const updateSessionToken = async (oldToken, newToken, expiresAt) => {
  const session = await prisma.session.update({
    where: { refreshToken: oldToken },
    data: {
      refreshToken: newToken,
      expiresAt,
    },
    select: {
      id: true,
      userId: true,
      refreshToken: true,
    },
  });

  return {
    id: session.id,
    user_id: session.userId,
    refresh_token: session.refreshToken,
  };
};

/**
 * Removes a specific refresh token session (logout of a single device)
 * @param {string} refreshToken 
 */
export const deleteSession = async (refreshToken) => {
  try {
    const session = await prisma.session.delete({
      where: { refreshToken },
      select: {
        id: true,
      },
    });
    return session;
  } catch (error) {
    return null;
  }
};

/**
 * Removes all active sessions for a user (absolute logout/device revocation)
 * @param {string} userId UUID
 */
export const deleteAllUserSessions = async (userId) => {
  const result = await prisma.session.deleteMany({
    where: { userId },
  });
  return { count: result.count };
};
