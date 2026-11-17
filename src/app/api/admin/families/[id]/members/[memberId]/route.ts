
import { db } from "@/src/prisma/db";
import { requireAdminSession } from "@/src/services/admin-auth";
import { Char } from "@prisma/orm-postgres/target/codec-types";
import { NextResponse } from "next/server";
import { isAgeGroup } from "@/src/libs/age-group";

const VALID_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "DECLINED",
] as const;

type RSVPStatus = (typeof VALID_STATUSES)[number];

type RouteContext = {
  params: Promise<{
    id: string;
    memberId: string;
  }>;
};

async function getMember(
  memberId: string,
  familyId: string,
) {
  const member = await db.orm.public.FamilyMember.where(
    (member) => member.id.eq(memberId as Char<36>)
  ).first();

  if (!member || member.familyId !== familyId) {
    return null;
  }

  return member;
}

export async function PATCH(
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

    const {
      id: familyId,
      memberId,
    } = await context.params;

    if (!familyId || !memberId) {
      return NextResponse.json(
        { error: "Família e membro são obrigatórios." },
        { status: 400 },
      );
    }

    const member = await getMember(memberId, familyId);

    if (!member) {
      return NextResponse.json(
        { error: "Membro não encontrado." },
        { status: 404 },
      );
    }

    const body = await request.json();

    const data: {
      name?: string;
      phone?: string | null;
      status?: RSVPStatus;
      ageGroup?:
        | "ADULT"
        | "CHILD_4_7"
        | "CHILD_UNDER_4";
    } = {};

    if (body.name !== undefined) {
      if (
        typeof body.name !== "string" ||
        !body.name.trim()
      ) {
        return NextResponse.json(
          { error: "O nome do membro é obrigatório." },
          { status: 400 },
        );
      }

      data.name = body.name.trim();
    }

    if (body.phone !== undefined) {
      if (
        body.phone !== null &&
        typeof body.phone !== "string"
      ) {
        return NextResponse.json(
          { error: "Telefone inválido." },
          { status: 400 },
        );
      }

      data.phone =
        typeof body.phone === "string" &&
        body.phone.trim()
          ? body.phone.trim()
          : null;
    }

    if (body.status !== undefined) {
      if (
        typeof body.status !== "string" ||
        !VALID_STATUSES.includes(
          body.status as RSVPStatus,
        )
      ) {
        return NextResponse.json(
          { error: "Status de RSVP inválido." },
          { status: 400 },
        );
      }

      data.status = body.status as RSVPStatus;
    }

    if (body.ageGroup !== undefined) {
      if (!isAgeGroup(body.ageGroup)) {
        return NextResponse.json(
          { error: "Classificação por idade inválida." },
          { status: 400 },
        );
      }

      data.ageGroup = body.ageGroup;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Nenhum campo para atualizar." },
        { status: 400 },
      );
    }

    const updatedMember =
      await db.orm.public.FamilyMember.where(
        (member) =>
          member.id.eq(memberId as Char<36>)
      ).update(data);

    return NextResponse.json(updatedMember, {
      status: 200,
    });
  } catch (error) {
    console.error(
      "PATCH /api/admin/families/[id]/members/[memberId] error:",
      error,
    );

    return NextResponse.json(
      { error: "Não foi possível atualizar o membro." },
      { status: 500 },
    );
  }
}

export async function DELETE(
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

    const {
      id: familyId,
      memberId,
    } = await context.params;

    if (!familyId || !memberId) {
      return NextResponse.json(
        { error: "Família e membro são obrigatórios." },
        { status: 400 },
      );
    }

    const member = await getMember(memberId, familyId);

    if (!member) {
      return NextResponse.json(
        { error: "Membro não encontrado." },
        { status: 404 },
      );
    }

    await db.orm.public.FamilyMember.where(
      (member) =>
        member.id.eq(memberId as Char<36>)
    ).delete();

    return NextResponse.json(
      { success: true },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "DELETE /api/admin/families/[id]/members/[memberId] error:",
      error,
    );

    return NextResponse.json(
      { error: "Não foi possível excluir o membro." },
      { status: 500 },
    );
  }
}
