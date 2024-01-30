import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'Not authorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name');

    return Response.json(orders);
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any;
