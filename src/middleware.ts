import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Mock mode: no auth checks, allow all access
  return NextResponse.next({ request });
}

export const config = {
  matcher: ["/admin/:path*"],
};
