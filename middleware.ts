import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { routeAccess } from "./lib/routes";

const matchers = Object.keys(routeAccess).map((route) => ({
  matcher: createRouteMatcher([route]),
  allowedRoles: routeAccess[route],
}));

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const url = new URL(req.url);

  const userRole = (sessionClaims?.metadata as { role?: string })?.role;

  console.log(userRole);
  const role = userId && userRole ? userRole : userId ? "patient" : "sign-in";

  const matchingRoute = matchers.find(({ matcher }) => matcher(req));

  if (matchingRoute && !matchingRoute.allowedRoles.includes(role)) {
    // Redirect unauthorized roles to their respective default pages
    return NextResponse.redirect(new URL(`/${role}`, url.origin));
  }

  // Continue if the user is authorized
  return NextResponse.next();
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
