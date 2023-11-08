import { JWT, getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import db from "../drizzle/db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export default async function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname;
  const dashboardPage = path.includes("/dashboard");
  const signInPage = path.includes("/sign-in");
  const setupPage = path.includes("/setup");
  const landingPage = "/"

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const role = await getRole(session) 

  if (path === landingPage) {
    return NextResponse.next();
  }
  else if (!session && dashboardPage) {
    return NextResponse.redirect(new URL("/sign-in", req.url));

  } else if (session && signInPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url)); 

  } else if (session && dashboardPage && !role) {
    return NextResponse.redirect(new URL("/setup", req.url));

  } else if (session && setupPage && role) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
    
  } else if (!session && setupPage) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

const getRole = async (session: JWT | null) => {
  const response = await db
  .select({ role: users.role })
  .from(users)
  .where(eq(users.email, session?.email as string))
  const role = response[0]?.role
  return role
}