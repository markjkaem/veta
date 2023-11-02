import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import db from '../drizzle/db';
import { users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

export default async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = req.nextUrl.pathname;

  // If it's the root path, just render it
  if (path === '/') {
    return NextResponse.next();
  }

  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const response = await db.select({role: users.role, stripe_id: users.stripe_id}).from(users).where(eq(users.email, session?.email as string))
  const isProtected = path.includes('/dashboard');

  if(session && path.includes('/dashboard') && !response[0]?.role ){
    return NextResponse.redirect(new URL('/setup', req.url));
  }

 if(session && path.includes('/setup') && response[0]?.role ){
  return NextResponse.redirect(new URL('/dashboard', req.url));
}
if(!session && path.includes('/setup')){
  return NextResponse.redirect(new URL('/sign-in', req.url));
}
  if (!session && isProtected) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
  else if (session && path.includes('/sign-in')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  return NextResponse.next();
}