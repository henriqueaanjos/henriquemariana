import { db } from "@/src/prisma/db";
import { getSessionRole, SESSION_COOKIE } from "@/src/services/admin-auth";
import { Char } from "@prisma/orm-postgres/target/codec-types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type RouteContext = {
    params: Promise<{
        guestId: string;
    }>;
};

export async function PATCH(
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

        const { guestId } = await context.params;

        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(guestId)) {
            return NextResponse.json(
                { error: "Identificador de convidado inválido." },
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

        if (member.checkedInAt) {
            return NextResponse.json(
                {
                    error: "Este convidado já realizou o check-in.",
                    checkedInAt: member.checkedInAt,
                },
                { status: 409 },
            );
        }

        const checkedInAt = new Date().toISOString();

        const updated = await db.orm.public.FamilyMember
            .where({
                id: guestId as Char<36>,
                checkedInAt: null,
            })
            .update({
                checkedInAt,
            });

        if (!updated) {
            return NextResponse.json(
                { error: "Não foi possível confirmar o check-in." },
                { status: 409 },
            );
        }

        return NextResponse.json({
            success: true,
            checkedInAt,
        });
    } catch (error) {
        console.error("PATCH /api/validator/guests/[guestId]:", error);

        return NextResponse.json(
            { error: "Não foi possível registrar a entrada." },
            { status: 500 },
        );
    }
}