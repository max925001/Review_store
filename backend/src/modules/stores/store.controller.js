import * as storeService from './store.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const createStore = asyncHandler(async (req, res) => {
  const createdBy = req.user.id;
  const store = await storeService.createStore({ ...req.body, createdBy });

  return res
    .status(201)
    .json(new ApiResponse(201, store, 'Store created successfully'));
});

export const assignOwner = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const { ownerId } = req.body;
  const store = await storeService.assignOwner(storeId, ownerId);

  return res
    .status(200)
    .json(new ApiResponse(200, store, 'Store owner assigned successfully'));
});

export const removeOwner = asyncHandler(async (req, res) => {
  const { storeId } = req.params;
  const { ownerId } = req.body;
  const store = await storeService.removeOwner(storeId, ownerId);

  return res
    .status(200)
    .json(new ApiResponse(200, store, 'Store owner removed successfully'));
});

export const getStore = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const store = await storeService.getStore(id);

  return res
    .status(200)
    .json(new ApiResponse(200, store, 'Store details fetched successfully'));
});

export const getStores = asyncHandler(async (req, res) => {
  const result = await storeService.getStores(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Stores fetched successfully'));
});

export const updateStore = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const store = await storeService.updateStore(id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, store, 'Store updated successfully'));
});

export const deleteStore = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await storeService.deleteStore(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Store deleted successfully'));
});

export const getStoreRatings = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const result = await storeService.getStoreRatings(id, { page, limit });

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Store ratings fetched successfully'));
});

export const getStoreSuggestions = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const result = await storeService.getStoreSuggestions({ search });

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Store suggestions fetched successfully'));
});

export const getSharedStores = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await storeService.getSharedStores(userId, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Shared stores listing fetched successfully'));
});

export const getSharedStore = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const result = await storeService.getSharedStore(id, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Store details fetched successfully'));
});

export const getSharedStoreRatings = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const result = await storeService.getStoreRatings(id, { page, limit });

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Store ratings fetched successfully'));
});

export const createStoreRating = asyncHandler(async (req, res) => {
  const { id: storeId } = req.params;
  const userId = req.user.id;
  const result = await storeService.createStoreRating(storeId, userId, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, result, 'Review submitted successfully'));
});

