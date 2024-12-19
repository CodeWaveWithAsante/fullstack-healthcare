import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { routeMatchers } from "./lib/routes";

const checkRoleAndRedirect = (
  req: NextRequest,
  role: string | undefined,
  allowedRole: keyof typeof routeMatchers
): NextResponse | undefined => {
  if (routeMatchers[allowedRole](req) && role !== allowedRole) {
    const url = new URL("/", req.url);
    console.log("Unauthorized access, redirecting to:", url);
    return NextResponse.redirect(url);
  }
};

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  // Role checks
  const response =
    checkRoleAndRedirect(req, role, "admin") ||
    checkRoleAndRedirect(req, role, "patient");

  if (response) return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
