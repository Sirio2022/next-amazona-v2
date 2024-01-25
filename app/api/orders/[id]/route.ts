import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import { auth } from '@/lib/auth';

export const GET = auth(async (...request: any) => {
  const [req, { params }] = request;
  if (!req.auth) {
    return Response.json(
      { message: 'Not autorized' },
      {
        status: 401,
      }
    );
  }
  await dbConnect();
  const order = await OrderModel.findById(params.id);

  if (!order) {
    return Response.json({ message: 'Order not found' }, { status: 404 });
  }

  return Response.json(order);
}) as any;
