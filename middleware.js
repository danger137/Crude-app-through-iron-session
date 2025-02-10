import { NextResponse } from "next/server";

export function middleware(req) {

  const token = req.cookies.get("session")?.value; 

  if (!token) {
    return NextResponse.redirect(new URL("/Login", req.url)); 
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/dashboard", "/todo","/api/todos"],
};

