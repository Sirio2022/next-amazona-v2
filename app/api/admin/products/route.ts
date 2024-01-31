import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    await dbConnect();
    const products = await ProductModel.find();
    return Response.json(products);
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any;

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    await dbConnect();
    const product = new ProductModel({
      name: 'Sample name',
      slug: 'sample-name-' + Math.random(),
      image: '/images/shirt1.jpg',
      price: 0,
      category: 'Sample category',
      brand: 'Sample brand',
      countInStock: 0,
      description: 'Sample description',
      rating: 0,
      numReviews: 0,
    });

    await product.save();
    return Response.json({ message: 'Product created successfully', product });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any;
