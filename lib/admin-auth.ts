import { cookies } from "next/headers";

const COOKIE_NAME = "gobeans_admin";

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || "gobeans-admin-dev-secret";
}

export function getOwnerPassword(): string {
  return process.env.OWNER_PASSWORD || "gobeans2024";
}

export function isAdminAuthenticated(cookieValue: string | undefined): boolean {
  return cookieValue === getAdminSecret();
}

export async function checkAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  return isAdminAuthenticated(cookieStore.get(COOKIE_NAME)?.value);
}

export function getAdminCookieName(): string {
  return COOKIE_NAME;
}
