
import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  SESSION_COOKIE,
  verifyPassword,
  verifyCerimonialPassword,
} from "../../../../services/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = body?.password;

    if (typeof password !== "string" || !password) {
      return NextResponse.json(
        { error: "Digite sua senha." },
        { status: 400 },
      );
    }

    let role: "admin" | "cerimonial" | null = null;

    if (verifyPassword(password)) {
      role = "admin";
    } else if (verifyCerimonialPassword(password)) {
      role = "cerimonial";
    }

    if (!role) {
      return NextResponse.json(
        { error: "Senha incorreta." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      success: true,
      role,
    });

    response.cookies.set({
      name: SESSION_COOKIE,
      value: createSession(role),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Não foi possível realizar o login." },
      { status: 500 },
    );
  }
}
