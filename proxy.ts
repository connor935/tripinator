import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// Optimistic redirect only — checks cookie presence, not validity.
// Authoritative session checks happen in lib/auth-session.ts (requireUser/requireAdmin).
export function proxy(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith("/login")) {
		return NextResponse.next();
	}
	if (!getSessionCookie(request)) {
		return NextResponse.redirect(new URL("/login", request.url));
	}
	return NextResponse.next();
}

export const config = {
	// /api is exempt: better-auth handles /api/auth itself, and the admin
	// template download checks the session in its route handler.
	matcher: [
		"/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|ico|txt|webmanifest)$).*)",
	],
};
