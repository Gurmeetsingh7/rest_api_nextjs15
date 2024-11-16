import { NextResponse } from "next/server";
import connect from "../../../../../lib/db";
import User from "../../../../../lib/models/users";
import { Types } from "mongoose";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching users" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();
    const newUser = new User(body);
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "User created succesfully", user: newUser }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in creating user" + error.message, {
      status: 500,
    });
  }
};
export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    await connect();

    const { userId, newUserName } = body;

    if (!userId || !newUserName) {
      return new NextResponse(
        JSON.stringify({ message: "ID and New User is Required" }),
        { status: 400 }
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid userID" }), {
        status: 400,
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      {
        _id: new ObjectId(userId),
      },
      {
        username: newUserName,
      },
      { new: true }
    );

    if (!updatedUser) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }
    return new NextResponse("Username updated succesfully" + updatedUser, {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error in updating user" + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "userID is Required" }),
        { status: 400 }
      );
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid userID" }), {
        status: 400,
      });
    }
    await connect();
    const deletedUser = await User.findByIdAndDelete({
      _id: new ObjectId(userId),
    });

    if (!deletedUser) {
        return new NextResponse(JSON.stringify({message:"User not found"}),{
            status: 404,
          });
    }
    return new NextResponse(JSON.stringify({message:"User Deleted succesfully"}),{
        status: 200,
      });
  } catch (error: any) {
    return new NextResponse("Error in updating user" + error.message, {
      status: 500,
    });
  }
};
