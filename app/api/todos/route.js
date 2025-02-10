import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers"; 

const prisma = new PrismaClient();


export async function GET(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("session"); 

    // Token check
    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized access" },
        { status: 401 }
      );
    }

   

    const todos = await prisma.todo.findMany();
    return NextResponse.json({ status: "success", data: todos });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 500 }
    );
  }
}






export async function POST(req) {
  try {
    const token = cookies().get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized: Token is missing" },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (!body || !body.title || typeof body.title !== "string") {
      return NextResponse.json(
        { status: "error", message: "Title must be a string and not empty" },
        { status: 400 }
      );
    }

    const newTodo = await prisma.todo.create({ data: { title: body.title } });

    return NextResponse.json({ status: "success", data: newTodo });
  } catch (error) {
    console.error("Error:", error.message || error);
    return NextResponse.json(
      { status: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}




