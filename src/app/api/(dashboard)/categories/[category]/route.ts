import { NextResponse } from "next/server";

import { Types } from "mongoose";
import connect from "../../../../../../lib/db";
import User from "../../../../../../lib/models/users";
import Category from "../../../../../../lib/models/category";
const ObjectId = require("mongoose").Types.ObjectId;

export const PATCH = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const body = await request.json();
    const { title } = body;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    await connect();

    if (!title) {
      return new NextResponse(
        JSON.stringify({ message: "Title is Required" }),
        { status: 400 }
      );
    }
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "missing or Invalid userID" }),
        {
          status: 400,
        }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "missing or Invalid category" }),
        {
          status: 400,
        }
      );
    }
    const userExist = await User.findById({
      _id: new ObjectId(userId),
    });
    if (!userExist) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }
    const userExistWithCategory = await Category.findOne(
      {
        _id: new ObjectId(categoryId),
      },
      {
        user: new ObjectId(userId),
      }
    );
    if (!userExistWithCategory) {
      return new NextResponse("Category not found", {
        status: 404,
      });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      {
        _id: new ObjectId(categoryId),
      },
      {
        title: title,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return new NextResponse("Category not found", {
        status: 404,
      });
    }
    return new NextResponse(
      JSON.stringify({ message: "Category updated Succesfully" }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating category" + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    await connect();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "missing or Invalid userID" }),
        {
          status: 400,
        }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "missing or Invalid category" }),
        {
          status: 400,
        }
      );
    }
    const userExist = await User.findById({
      _id: new ObjectId(userId),
    });
    if (!userExist) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }
    const userExistWithCategory = await Category.findOne(
      {
        _id: new ObjectId(categoryId),
      },
      {
        user: new ObjectId(userId),
      }
    );
    if (!userExistWithCategory) {
      return new NextResponse("Category not found", {
        status: 404,
      });
    }
    const updatedCategory = await Category.findByIdAndDelete({
      _id: new ObjectId(categoryId),
    });

    if (!updatedCategory) {
      return new NextResponse("Category not found", {
        status: 404,
      });
    }
    return new NextResponse("Category deleted succesfully", {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error in deleting category" + error.message, {
      status: 500,
    });
  }
};
