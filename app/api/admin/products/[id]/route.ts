import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args;

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const product = await ProductModel.findById(params.id);
    if (product) {
      await product.deleteOne();
      return Response.json({ message: 'Product removed successfully' });
    }
    return Response.json({ message: 'Product not found' }, { status: 404 });
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
});
