import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";

export async function GET(req, res) { // ✅ Ensure it's declared only once
  const session = await getIronSession(req, res, {
    password: process.env.SESSION_SECRET, // ✅ Make sure this is at least 32 characters
    cookieName: "session",
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 3600, // 1 hour
    },
  });

  if (!session.user) {
    return NextResponse.json({ success: false, message: "No session found" });
  }

  return NextResponse.json({ success: true, user: session.user });
}
