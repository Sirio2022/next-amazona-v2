import dbConnect from '@/lib/dbConnect';
import { auth } from '@/lib/auth';
import OrderModel from '@/lib/models/OrderModel';
import UserModel from '@/lib/models/UserModel';
import ProductModel from '@/lib/models/ProductModel';

export const GET = auth(async (...request: any) => {
  const [req, { params }] = request;

  if (!req.auth) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const ordersCount = await OrderModel.countDocuments();
  const usersCount = await UserModel.countDocuments();
  const productsCount = await ProductModel.countDocuments();

  const ordersPriceGroup = await OrderModel.aggregate([
    {
      $group: {
        _id: null,
        sales: { $sum: '$totalPrice' },
      },
    },
  ]);

  const ordersPrice =
    ordersPriceGroup.length > 0 ? ordersPriceGroup[0].sales : 0;

  const salesData = await OrderModel.aggregate([
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
  ]);

  const usersData = await UserModel.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalUsers: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return Response.json(
    {
      ordersCount,
      usersCount,
      productsCount,
      ordersPrice,
      salesData,
      usersData,
    },
    { status: 200 }
  );
});
