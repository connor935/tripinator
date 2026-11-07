import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { db } from "@/lib/db";

// Registration is closed: admins create accounts on /admin/users, the first
// admin comes from `npm run admin:create`. ALLOW_SIGNUP=true reopens the
// better-auth sign-up endpoint (there is no sign-up page; it is meant for
// scripted/API use only).
export const signupAllowed = process.env.ALLOW_SIGNUP === "true";

// Client forms get this as a prop from server components (process.env is not
// available in the browser).
export const passwordMinLength = process.env.MINIMUM_PASSWORD_LENGTH
	? Number.parseInt(process.env.MINIMUM_PASSWORD_LENGTH, 10)
	: 12;

// Origins allowed to call the auth API. BETTER_AUTH_URL is always trusted; add
// more as a comma-separated TRUSTED_ORIGINS env.
const trustedOrigins = [
	...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
	...(process.env.TRUSTED_ORIGINS ?? "")
		.split(",")
		.map((o) => o.trim())
		.filter(Boolean),
].filter((o, i, a) => a.indexOf(o) === i);

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg" }),
	trustedOrigins,
	emailAndPassword: {
		enabled: true,
		disableSignUp: !signupAllowed,
		minPasswordLength: passwordMinLength,
	},
	// nextCookies must stay the last plugin
	plugins: [admin(), nextCookies()],
});
