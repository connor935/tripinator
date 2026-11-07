import "server-only";

import { cookies } from "next/headers";
import { createI18n, LANGUAGE_COOKIE, toLanguage } from "@/lib/i18n";

export async function getLanguage() {
	return toLanguage((await cookies()).get(LANGUAGE_COOKIE)?.value);
}

// Translation function for server components and server actions.
export async function getT() {
	return createI18n(await getLanguage()).t;
}
