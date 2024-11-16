import { NextResponse } from "next/server";

import { Types } from "mongoose";
import connect from "../../../../../../lib/db";
import User from "../../../../../../lib/models/users";
import Category from "../../../../../../lib/models/category";
import Blog from "../../../../../../lib/models/blog";
const ObjectId = require("mongoose").Types.ObjectId;

export const PATCH = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const body = await request.json();
    const { title, description } = body;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!title || !description) {
      return new NextResponse(
        JSON.stringify({ message: "Title and description is Required" }),
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
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "missing or Invalid blogId" }),
        {
          status: 400,
        }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "missing or Invalid categoryId" }),
        {
          status: 400,
        }
      );
    }
    await connect();
    const userExist = await User.findById({
      _id: new ObjectId(userId),
    });
    if (!userExist) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }
    const CategoryExist = await Category.findById({
      _id: new ObjectId(categoryId),
    });

    if (!CategoryExist) {
      return new NextResponse("Category not found", {
        status: 404,
      });
    }
    const userExistWithCategory = await Blog.findOne(
      {
        _id: new ObjectId(blogId),
      },
      {
        category: new ObjectId(categoryId),
      },
      {
        user: new ObjectId(userId),
      }
    );
    if (!userExistWithCategory) {
      return new NextResponse("Blog not found", {
        status: 404,
      });
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      {
        _id: new ObjectId(blogId),
      },
      {
        title: title,
        description: description,
      },

      { new: true }
    );

    if (!updatedBlog) {
      return new NextResponse("Blog not found", {
        status: 404,
      });
    }
    return new NextResponse(
      JSON.stringify({ message: "Blog updated Succesfully", updatedBlog }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating Blog" + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "missing or Invalid userID" }),
        {
          status: 400,
        }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "missing or Invalid category" }),
        {
          status: 400,
        }
      );
    }
    await connect();
    const userExist = await User.findById({
      _id: new ObjectId(userId),
    });
    if (!userExist) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }
    const userExistWithBlog = await Blog.findOne(
      {
        _id: new ObjectId(blogId),
      },
      {
        user: new ObjectId(userId),
      }
    );
    if (!userExistWithBlog) {
      return new NextResponse("Blog not found", {
        status: 404,
      });
    }
    const blog = await Blog.findByIdAndDelete({
      _id: new ObjectId(blogId),
    });

    if (!blog) {
      return new NextResponse("Blog not found", {
        status: 404,
      });
    }
    return new NextResponse("Blog deleted succesfully", {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error in deleting Blog" + error.message, {
      status: 500,
    });
  }
};
