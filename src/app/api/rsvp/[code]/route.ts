import { db } from "@/src/prisma/db";
import { Char } from "@prisma/orm-postgres/target/codec-types";
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
    const { code } = await context.params;

    if (!code) {
      return NextResponse.json(
        { error: "Código da família é obrigatório." },
        { status: 400 },
      );
    }

    const family = await db.orm.public.Family.where((p) => p.code.eq(code.trim().toUpperCase())).first();

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

    return NextResponse.json(
      {
        id: family.id,
        code: family.code,
        name: family.name,
        members: [...members].map((member) => ({
          id: member.id,
          name: member.name,
          status: member.status,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/rsvp/[code] error:", error);

    return NextResponse.json(
      { error: "Não foi possível carregar o convite." },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    const { code } = await context.params;

    if (!code) {
      return NextResponse.json(
        { error: "Código da família é obrigatório." },
        { status: 400 },
      );
    }

    const family = await db.orm.public.Family.where((p) => p.code.eq(code.trim().toUpperCase())).first();

    if (!family) {
      return NextResponse.json(
        { error: "Convite não encontrado." },
        { status: 404 },
      );
    }

    if (!family) {
      return NextResponse.json(
        { error: "Convite não encontrado." },
        { status: 404 },
      );
    }

    const body = await request.json();

    if (!Array.isArray(body.members)) {
      return NextResponse.json(
        { error: "A lista de convidados é obrigatória." },
        { status: 400 },
      );
    }

    if (body.members.length === 0) {
      return NextResponse.json(
        { error: "Nenhum convidado informado." },
        { status: 400 },
      );
    }

    const members = await db.orm.public.FamilyMember
      .where({
        familyId: family.id,
      })
      .all();

    const familyMembers = [...members];

    const submittedIds = new Set<string>();

    for (const item of body.members) {
      if (
        typeof item !== "object" ||
        item === null ||
        typeof item.id !== "string" ||
        typeof item.status !== "string"
      ) {
        return NextResponse.json(
          { error: "Dados de RSVP inválidos." },
          { status: 400 },
        );
      }

      if (submittedIds.has(item.id)) {
        return NextResponse.json(
          { error: "Um convidado foi informado mais de uma vez." },
          { status: 400 },
        );
      }

      submittedIds.add(item.id);

      if (
        item.status !== "CONFIRMED" &&
        item.status !== "DECLINED"
      ) {
        return NextResponse.json(
          { error: "Status de RSVP inválido." },
          { status: 400 },
        );
      }

      const member = familyMembers.find(
        (familyMember) => familyMember.id === item.id,
      );

      if (!member) {
        return NextResponse.json(
          { error: "Um dos convidados não pertence a este convite." },
          { status: 400 },
        );
      }
    }

    const updatedMembers = await Promise.all(
      body.members.map(
        (item: {
          id: string;
          status: "CONFIRMED" | "DECLINED";
        }) =>
          db.orm.public.FamilyMember.where((member) => member.id.eq(item.id as Char<36>)).update({
              status: item.status,
            }),
      ),
    );

    return NextResponse.json(
      {
        success: true,
        members: updatedMembers,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("POST /api/rsvp/[code] error:", error);

    return NextResponse.json(
      { error: "Não foi possível registrar o RSVP." },
      { status: 500 },
    );
  }
}