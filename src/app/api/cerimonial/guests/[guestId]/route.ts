
import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { requireCerimonialSession } from "@/src/services/admin-auth";
import { Char } from "@prisma/orm-postgres/target/codec-types";

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "DECLINED",
] as const;

type RouteContext = {
  params: Promise<{
    guestId: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const authorized = await requireCerimonialSession();

    if (!authorized) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 },
      );
    }

    const { guestId } = await context.params;
    const body = await request.json();

    if (
      typeof body.status !== "string" ||
      !VALID_STATUSES.includes(
        body.status as (typeof VALID_STATUSES)[number],
      )
    ) {
      return NextResponse.json(
        { error: "Status de confirmação inválido." },
        { status: 400 },
      );
    }

    const member = await db.orm.public.FamilyMember
      .where((item) => item.id.eq(guestId as Char<36>))
      .first();

    if (!member) {
      return NextResponse.json(
        { error: "Convidado não encontrado." },
        { status: 404 },
      );
    }

    const updated = await db.orm.public.FamilyMember
      .where((item) => item.id.eq(guestId as Char<36>))
      .update({
        status: body.status,
      });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/cerimonial/guests/[guestId]:", error);

    return NextResponse.json(
      { error: "Não foi possível atualizar a confirmação." },
      { status: 500 },
    );
  }
}
