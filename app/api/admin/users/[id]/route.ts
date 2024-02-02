import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';

export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args;

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      }
    );
  }

  try {
    await dbConnect();

    const user = await UserModel.findById(params.id);

    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    if (user) {
      if (user.isAdmin)
        return Response.json(
          { message: 'Cannot delete an admin' },
          { status: 400 }
        );

      await user.deleteOne();
      return Response.json({ message: 'User deleted successfully!' });
    }
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any;
