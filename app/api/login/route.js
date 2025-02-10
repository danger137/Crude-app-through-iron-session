import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getIronSession } from "iron-session";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email, password },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Response
    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    });

    const session = await getIronSession(req, res, {
      password: process.env.SESSION_SECRET,
      cookieName: "session",
      cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
        maxAge: 3600, 
      },
    });

    session.user = { id: user.id, name: user.name, email: user.email };
    await session.save();

    return res;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
