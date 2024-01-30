import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

export const PUT = auth(async (...request: any) => {
  const [req, { params }] = request;

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const order = await OrderModel.findById(params.id);

    if (order) {
      if (!order.isPaid) {
        return Response.json({ message: 'Order not paid' }, { status: 400 });
      }

      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();

      return Response.json(updatedOrder);
    } else {
      return Response.json({ message: 'Order not found' }, { status: 404 });
    }
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any;
