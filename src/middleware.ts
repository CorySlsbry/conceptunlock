import { type NextRequest } from "next/server";
import { refreshSession } from "@/lib/supabase/middleware";

/**
 * Middleware — refreshes the Supabase session and captures referral arrivals
 * (?r=CODE or ?ref=CODE) into a 30-day cookie so the referred friend gets
 * 20% off automatically at checkout. ConceptUnlock doesn't gate any
 * routes in middleware; all pages are public except API endpoints that
 * check auth themselves.
 */
export async function middleware(request: NextRequest) {
  const { response } = await refreshSession(request);

  const incomingRef =
    request.nextUrl.searchParams.get("r") ||
    request.nextUrl.searchParams.get("ref");
  if (incomingRef && !request.cookies.get("ref_code")?.value) {
    response.cookies.set("ref_code", incomingRef.toUpperCase(), {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
