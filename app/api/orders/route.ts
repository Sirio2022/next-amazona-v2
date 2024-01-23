import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel, { OrderItem } from '@/lib/models/OrderModel';
import ProductModel from '@/lib/models/ProductModel';
import { round2 } from '@/lib/utils';

const calcPrices = (orderItems: OrderItem[]) => {
  // Calculate the items price
  const itemsPrice = round2(
    orderItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  // Calculate the shipping price
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  // Calculate the tax price
  const taxPrice = Number(round2(0.15 * itemsPrice).toFixed(2));
  // Calculate the total price
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};

export const POST = auth(async (req: any) => {
  if (!req.auth) {
    return Response.json({ message: 'Not authorized' }, { status: 401 });
  }

  const { user } = req.auth;

  try {
    const payload = await req.body.json();
    await dbConnect();

    const dbProductPrices = await ProductModel.find(
      {
        _id: { $in: payload.items.map((item: { _id: string }) => item._id) },
      },
      'price'
    );

    const dbOrderItems = payload.items.map((item: { _id: string }) => ({
      ...item,
      product: item._id,
      price: dbProductPrices.find((x) => x._id === item._id)?.price,
      _id: undefined,
    }));

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const newOrder = new OrderModel({
      items: dbOrderItems,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      user: user._id,
    });

    const createdOrder = await newOrder.save();

    return Response.json(
      {
        message: 'New order created',
        order: createdOrder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
});
