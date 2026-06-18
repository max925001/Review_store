import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  limit: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again in a minute.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
