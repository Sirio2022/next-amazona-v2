import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args; // Destructure the request object and the params object from the args array

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

    return Response.json(user);
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any;

export const PUT = auth(async (...args: any) => {
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

    const { name, email, isAdmin } = await req.json();

    if (user) {
      user.name = name;
      user.email = email;
      user.isAdmin = Boolean(isAdmin);

      const updatedUser = await user.save();
      return Response.json({
        message: 'User updated successfully!',
        user: updatedUser,
      });
    }
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}) as any;

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
