
import { NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { requireCerimonialSession } from "@/src/services/admin-auth";

export async function GET() {
  try {
    const authorized = await requireCerimonialSession();

    if (!authorized) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 },
      );
    }

    const families = await db.orm.public.Family.all();

    const result = await Promise.all(
      [...families].map(async (family) => {
        const members = await db.orm.public.FamilyMember
          .where({ familyId: family.id })
          .orderBy((member) => member.createdAt.asc())
          .all();

        return [...members].map((member) => ({
          id: member.id,
          familyId: family.id,
          familyName: family.name,
          familyCode: family.code,
          name: member.name,
          phone: member.phone,
          status: member.status,
        }));
      }),
    );

    return NextResponse.json(result.flat());
  } catch (error) {
    console.error("GET /api/cerimonial/guests:", error);

    return NextResponse.json(
      { error: "Não foi possível carregar os convidados." },
      { status: 500 },
    );
  }
}
