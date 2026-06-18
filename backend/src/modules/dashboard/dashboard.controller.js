import prisma from '../../config/prisma.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      totalUsers,
      totalStores,
      totalRatings
    }, 'Dashboard stats fetched successfully')
  );
});
