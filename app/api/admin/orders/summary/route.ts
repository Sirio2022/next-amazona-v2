import dbConnect from '@/lib/dbConnect';
import { auth } from '@/lib/auth';
import OrderModel from '@/lib/models/OrderModel';
import UserModel from '@/lib/models/UserModel';
import ProductModel from '@/lib/models/ProductModel';

export const GET = auth(async (...request: any) => {
  const [req, { params }] = request;

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const ordersCount = await OrderModel.countDocuments();
  const usersCount = await UserModel.countDocuments();
  const productsCount = await ProductModel.countDocuments();

  const ordersPriceGroup = (await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ])) as any;

  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const salesData = (await OrderModel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])) as any;

  const productsData = (await ProductModel.aggregate([
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])) as any;

  const usersData = (await UserModel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalUsers: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ])) as any;

  return Response.json({
    ordersCount,
    usersCount,
    productsCount,
    ordersPrice,
    salesData,
    usersData,
    productsData,
  });
}) as any;
