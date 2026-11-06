import { db } from "@/src/prisma/db";
import { getSessionRole, SESSION_COOKIE } from "@/src/services/admin-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    code: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const role = getSessionRole(token);

    if (role !== "admin" && role !== "cerimonial") {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 },
      );
    }

    const { code } = await context.params;
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      return NextResponse.json(
        { error: "Código da família obrigatório." },
        { status: 400 },
      );
    }

    const family = await db.orm.public.Family
      .where((item) => item.code.eq(normalizedCode))
      .first();

    if (!family) {
      return NextResponse.json(
        { error: "Convite não encontrado." },
        { status: 404 },
      );
    }

    const members = await db.orm.public.FamilyMember
      .where({
        familyId: family.id,
      })
      .orderBy((member) => member.createdAt.asc())
      .all();

    return NextResponse.json({
      id: family.id,
      code: family.code,
      name: family.name,
      members: [...members].map((member) => ({
        id: member.id,
        name: member.name,
        status: member.status,
        checkedInAt: member.checkedInAt,
      })),
    });
  } catch (error) {
    console.error("GET /api/validator/families/[code]:", error);

    return NextResponse.json(
      { error: "Não foi possível validar o convite." },
      { status: 500 },
    );
  }
}