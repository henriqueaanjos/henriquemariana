
import { db } from "@/src/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const messages = await db.orm.public.Message.orderBy(p => p.createdAt.desc()).all();

    return NextResponse.json(messages, {
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);

    return NextResponse.json(
      {
        error: "Não foi possível buscar as mensagens.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, message } = body;

    if (
      typeof name !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        {
          error: "Nome e mensagem são obrigatórios.",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedName = name.trim();
    const normalizedMessage = message.trim();

    const newMessage = await db.orm.public.Message.create({
        name: normalizedName,
        message: normalizedMessage,
    })

    return NextResponse.json(newMessage, {
      status: 201,
    });
  } catch (error) {
    console.error("Erro ao criar mensagem:", error);

    return NextResponse.json(
      {
        error: "Não foi possível enviar a mensagem.",
      },
      {
        status: 500,
      },
    );
  }
}