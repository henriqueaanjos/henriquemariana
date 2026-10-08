import { NextResponse } from "next/server";

const ASAAS_API_URL = process.env.ASAAS_API_URL;
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export async function POST(request: Request) {
  try {
    if (!ASAAS_API_URL || !ASAAS_API_KEY || !SITE_URL) {
      console.error("Asaas não configurado:", {
        hasApiUrl: Boolean(ASAAS_API_URL),
        hasApiKey: Boolean(ASAAS_API_KEY),
        hasSiteUrl: Boolean(SITE_URL),
      });

      return NextResponse.json(
        {
          error: "Asaas não configurado.",
        },
        { status: 500 },
      );
    }

    const body = await request.json();
    const amount = Number(body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        {
          error: "Valor inválido.",
        },
        { status: 400 },
      );
    }

    const response = await fetch(`${ASAAS_API_URL}/checkouts`, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mariana & Henrique Wedding",
        access_token: ASAAS_API_KEY,
      },
      body: JSON.stringify({
        billingTypes: ["CREDIT_CARD"],
        chargeTypes: ["DETACHED"],
        minutesToExpire: 60,

        callback: {
          successUrl: `${SITE_URL}/gifts/success`,
          cancelUrl: `${SITE_URL}/gifts/cancel`,
          expiredUrl: `${SITE_URL}/gifts/expired`,
        },

        items: [
          {
            name: "Presente de casamento",
            description: "Contribuição para Mariana & Henrique",
            quantity: 1,
            value: amount,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Asaas checkout error:", data);

      return NextResponse.json(
        {
          error: "Não foi possível criar o checkout.",
        },
        { status: response.status },
      );
    }

    if (!data.id || !data.link) {
      console.error("Asaas não retornou o checkout:", data);

      return NextResponse.json(
        {
          error: "Checkout não retornado pelo Asaas.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      id: data.id,
      checkoutUrl: data.link,
    });
  } catch (error) {
    console.error("Erro ao criar checkout:", error);

    return NextResponse.json(
      {
        error: "Erro interno ao criar checkout.",
      },
      { status: 500 },
    );
  }
}