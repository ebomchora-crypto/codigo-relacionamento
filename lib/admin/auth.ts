import { createHash } from "crypto";

export const ADMIN_COOKIE_NAME = "ocds_admin";

function getAdminPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  return password && password.length > 0 ? password : null;
}

export function computeAdminToken(): string | null {
  const password = getAdminPassword();
  if (!password) return null;
  return createHash("sha256").update(`ocds-admin:${password}`).digest("hex");
}

export function checkAdminPassword(candidate: string): boolean {
  const password = getAdminPassword();
  if (!password) return false;
  return candidate === password;
}

export function isValidAdminToken(token: string | undefined): boolean {
  const expected = computeAdminToken();
  if (!expected || !token) return false;
  return token === expected;
}
