import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/lib/models/UserModel';

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json();

  await dbConnect();

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();

    return Response.json(
      {
        message: 'User created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return Response.json(
        {
          message: 'User already exists' || error.message,
        },
        { status: 400 }
      );
    }
  }
};
