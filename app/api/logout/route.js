import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";

export async function POST(req) {
  const res = NextResponse.json({ success: true });

  // Clear session
  const session = await getIronSession(req, res, {
    password: process.env.SESSION_SECRET, // ✅ 32-character password required
    cookieName: "session",
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
      maxAge: 0, // ✅ Immediately expire session
    },
  });

  session.destroy(); // ✅ Destroy session properly

  return res;
}
