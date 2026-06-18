import prisma from '../../config/prisma.js';

export const createStore = async ({ name, email, address, createdBy }) => {
  const store = await prisma.store.create({
    data: {
      name,
      email,
      address,
      createdBy,
    },
  });
  return {
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    createdBy: store.createdBy,
    total_review_user: store.totalReviewUser,
    avgrating: store.avgrating ? Number(store.avgrating) : 0,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
  };
};

export const findById = async (id) => {
  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      employees: {
        select: {
          userId: true,
          name: true,
          email: true,
          role: true,
          address: true,
        },
      },
      ratings: {
        select: {
          rating: true,
        },
      },
    },
  });

  if (!store) return null;

  const ratingsCount = store.ratings.length;
  const ratingsSum = store.ratings.reduce((sum, r) => sum + Number(r.rating), 0);
  const averageRating = ratingsCount > 0 ? Number((ratingsSum / ratingsCount).toFixed(1)) : 0;

  return {
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
    createdBy: store.createdBy,
    total_review_user: store.totalReviewUser,
    avgrating: store.avgrating ? Number(store.avgrating) : 0,
    averageRating,
    totalRatings: ratingsCount,
    owners: store.employees.filter(emp => emp.role === 'OWNER').map(emp => ({
      id: emp.userId,
      name: emp.name,
      email: emp.email,
      address: emp.address,
    })),
    employeesList: store.employees.filter(emp => emp.role === 'EMPLOYEE_USER').map(emp => ({
      id: emp.userId,
      name: emp.name,
      email: emp.email,
      address: emp.address,
    })),
  };
};

export const findByEmail = async (email) => {
  const store = await prisma.store.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return store || null;
};

export const updateStore = async (id, updates) => {
  const data = {};
  if (updates.name !== undefined) data.name = updates.name;
  if (updates.email !== undefined) data.email = updates.email;
  if (updates.address !== undefined) data.address = updates.address;

  if (Object.keys(data).length === 0) {
    return findById(id);
  }

  const store = await prisma.store.update({
    where: { id },
    data,
  });

  return {
    id: store.id,
    name: store.name,
    email: store.email,
    address: store.address,
    createdBy: store.createdBy,
    total_review_user: store.totalReviewUser,
    avgrating: store.avgrating ? Number(store.avgrating) : 0,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
  };
};

export const deleteStore = async (id) => {
  const store = await prisma.store.delete({
    where: { id },
    select: { id: true },
  });
  return store;
};

export const findAll = async ({
  search,
  ownerAssigned,
  ratingMin,
  ratingMax,
  createdAfter,
  createdBefore,
  sortBy,
  order,
  offset,
  limit
}) => {
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (ownerAssigned === true) {
    where.employees = {
      some: {
        role: 'OWNER',
      },
    };
  } else if (ownerAssigned === false) {
    where.employees = {
      none: {
        role: 'OWNER',
      },
    };
  }

  if (createdAfter || createdBefore) {
    where.createdAt = {};
    if (createdAfter) {
      where.createdAt.gte = new Date(createdAfter);
    }
    if (createdBefore) {
      where.createdAt.lte = new Date(createdBefore);
    }
  }

  if (ratingMin !== undefined || ratingMax !== undefined) {
    where.avgrating = {};
    if (ratingMin !== undefined) {
      where.avgrating.gte = ratingMin;
    }
    if (ratingMax !== undefined) {
      where.avgrating.lte = ratingMax;
    }
  }

  let orderBy = {};
  const actualOrder = order === 'asc' ? 'asc' : 'desc';

  if (sortBy === 'name') {
    orderBy = { name: actualOrder };
  } else if (sortBy === 'email') {
    orderBy = { email: actualOrder };
  } else if (sortBy === 'averageRating') {
    orderBy = { avgrating: actualOrder };
  } else {
    orderBy = { createdAt: actualOrder };
  }

  const [totalCount, stores] = await Promise.all([
    prisma.store.count({ where }),
    prisma.store.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      include: {
        employees: {
          where: { role: 'OWNER' },
          select: {
            userId: true,
            name: true,
            email: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    }),
  ]);

  return stores.map(store => {
    const ratingsCount = store.ratings.length;
    const ratingsSum = store.ratings.reduce((sum, r) => sum + Number(r.rating), 0);
    const averageRating = ratingsCount > 0 ? Number((ratingsSum / ratingsCount).toFixed(1)) : 0;

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      createdAt: store.createdAt,
      total_review_user: store.totalReviewUser,
      avgrating: store.avgrating ? Number(store.avgrating) : 0,
      averageRating,
      owners: store.employees.map(emp => ({
        id: emp.userId,
        name: emp.name,
        email: emp.email,
      })),
      totalCount,
    };
  });
};

/**
 * Find paginated reviews/ratings for a specific store location
 */
export const findStoreRatings = async (storeId, { offset, limit }) => {
  const [totalCount, ratings] = await Promise.all([
    prisma.rating.count({ where: { storeId } }),
    prisma.rating.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    ratings: ratings.map(r => ({
      id: r.id,
      rating: Number(r.rating),
      comment: r.comment,
      createdAt: r.createdAt,
      user: r.user
    })),
    totalCount
  };
};

export const findSuggestions = async (search) => {
  const where = {};
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }

  const stores = await prisma.store.findMany({
    where,
    select: {
      id: true,
      name: true
    },
    take: 10,
    orderBy: {
      name: 'asc'
    }
  });

  return stores;
};


