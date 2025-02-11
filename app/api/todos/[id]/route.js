import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  try {
   
   



   
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "ID is required in the URL" },
        { status: 400 }
      );
    }


    const { title } = await req.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { status: "error", message: "Title must be a non-empty string" },
        { status: 400 }
      );
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json({ status: "success", data: updatedTodo });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { status: "error", message: "Todo not found or update failed" },
      { status: 500 }
    );
  }
}


export async function DELETE(req, { params }) {
  try {

    const id = await params.id;

    if (!id) {
      return NextResponse.json(
        { status: "error", message: "ID is required in the URL" },
        { status: 400 }
      );
    }

    await prisma.todo.delete({
      where: { id },
    });

    return NextResponse.json({ status: "success", message: "Todo deleted" });
  } catch (error) {
    console.error("Prisma Error:", error);
    return NextResponse.json(
      { status: "error", message: "Todo not found or failed to delete" },
      { status: 500 }
    );
  }
}

