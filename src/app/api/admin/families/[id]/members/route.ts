
import { db } from "@/src/prisma/db";
import { requireAdminSession } from "@/src/services/admin-auth";
import { Char } from "@prisma/orm-postgres/target/codec-types";
import { NextResponse } from "next/server";
import { isAgeGroup } from "@/src/libs/age-group";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const isAdmin = await requireAdminSession();

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    const family = await db.orm.public.Family.where((p) =>
      p.id.eq(id as Char<36>)
    ).first();

    if (!family) {
      return NextResponse.json(
        { error: "Família não encontrada." },
        { status: 404 },
      );
    }

    const members =
      await db.orm.public.FamilyMember.where((member) =>
        member.familyId.eq(id as Char<36>)
      ).orderBy(
        (member) => member.createdAt.asc(),
      ).all();

    return NextResponse.json([...members]);
  } catch (error) {
    console.error(
      "GET /api/admin/families/[id]/members error:",
      error,
    );

    return NextResponse.json(
      { error: "Não foi possível buscar os convidados." },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    const isAdmin = await requireAdminSession();

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    const family = await db.orm.public.Family.where((p) =>
      p.id.eq(id as Char<36>)
    ).first();

    if (!family) {
      return NextResponse.json(
        { error: "Família não encontrada." },
        { status: 404 },
      );
    }

    const body = await request.json();

    if (
      typeof body.name !== "string" ||
      !body.name.trim()
    ) {
      return NextResponse.json(
        { error: "O nome do convidado é obrigatório." },
        { status: 400 },
      );
    }

    if (
      body.phone !== undefined &&
      body.phone !== null &&
      typeof body.phone !== "string"
    ) {
      return NextResponse.json(
        { error: "Telefone inválido." },
        { status: 400 },
      );
    }

    if (
      body.ageGroup !== undefined &&
      !isAgeGroup(body.ageGroup)
    ) {
      return NextResponse.json(
        { error: "Classificação por idade inválida." },
        { status: 400 },
      );
    }

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const member = await db.orm.public.FamilyMember.create({
      familyId: id as Char<36>,
      name: body.name.trim(),
      ...(phone ? { phone } : {}),
      ...(isAgeGroup(body.ageGroup)
        ? { ageGroup: body.ageGroup }
        : {}),
    });

    return NextResponse.json(member, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "POST /api/admin/families/[id]/members error:",
      error,
    );

    return NextResponse.json(
      { error: "Não foi possível adicionar o convidado." },
      { status: 500 },
    );
  }
}
