import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { auth } from '@/lib/auth';

export const GET = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json(
      {
        status: 401,
        message: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }

  const { user } = req.auth;
  await dbConnect();

  const orders = await OrderModel.find({ user: user._id });
  return Response.json(orders);
}) as any;
