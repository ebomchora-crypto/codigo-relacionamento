import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, checkAdminPassword, computeAdminToken } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const password = form?.get("password");

  if (typeof password !== "string" || !checkAdminPassword(password)) {
    const url = new URL("/admin/login?error=1", request.url);
    return NextResponse.redirect(url, { status: 303 });
  }

  const token = computeAdminToken();
  const url = new URL("/admin", request.url);
  const response = NextResponse.redirect(url, { status: 303 });

  response.cookies.set(ADMIN_COOKIE_NAME, token ?? "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
