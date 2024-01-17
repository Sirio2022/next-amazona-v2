import { cache } from 'react';
import dbConnect from '../dbConnect';
import ProductModel, { Product } from '../models/ProductModel';

export const revalidate = 3600; // 1 hour

const getLatest = cache(async () => {
  await dbConnect();
  const products = await ProductModel.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
  return products as Product[];
});

const getFeatured = cache(async () => {
  await dbConnect();
  const products = await ProductModel.find({ isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
  return products as Product[];
});

const getBySlug = cache(async (slug: string) => {
  await dbConnect();
  const product = await ProductModel.findOne({ slug }).lean();
  return product as Product;
});

const productService = {
  getLatest,
  getFeatured,
  getBySlug,
};

export default productService;
