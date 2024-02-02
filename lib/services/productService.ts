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

const PAGE_SIZE = 3;
const getByQuery = cache(
  async ({
    q,
    category,
    sort,
    price,
    rating,
    page = '1',
  }: {
    q: string;
    category: string;
    sort: string;
    price: string;
    rating: string;
    page: string;
  }) => {
    await dbConnect();

    const queryFilter =
      q && q !== 'all' ? { name: { $regex: q, $options: 'i' } } : {};

    const categoryFilter = category && category !== 'all' ? { category } : {};

    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};

    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};

    const order: Record<string, 1 | -1> =
      sort === 'lowest'
        ? { price: 1 }
        : sort === 'highest'
        ? { price: -1 }
        : sort === 'toprated'
        ? { rating: -1 }
        : { _id: -1 };

    const categories = await ProductModel.find().distinct('category');

    const products = await ProductModel.find(
      {
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
      },
      '-reviews'
    )
      .sort(order)
      .limit(PAGE_SIZE)
      .skip(PAGE_SIZE * (Number(page) - 1))
      .lean();

    const countProducts = await ProductModel.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });

    return {
      products: products as Product[],
      countProducts,
      page,
      pages: Math.ceil(countProducts / PAGE_SIZE),
      categories,
    };
  }
);

const getCategories = cache(async () => {
  await dbConnect();
  const categories = await ProductModel.find().distinct('category');
  return categories;
});

const productService = {
  getLatest,
  getFeatured,
  getBySlug,
  getByQuery,
  getCategories,
};

export default productService;
