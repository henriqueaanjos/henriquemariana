import { NextResponse } from "next/server";

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = process.env.ASAAS_API_URL;

export async function POST(request: Request) {
    try {
        console.log("ENV ASAAS:", {
            apiUrl: process.env.ASAAS_API_URL,
            hasApiKey: Boolean(process.env.ASAAS_API_KEY),
            apiKeyLength: process.env.ASAAS_API_KEY?.length,
        });
        if (!ASAAS_API_URL || !ASAAS_API_KEY) {
            console.error("Asaas não configurado:", {
                hasApiUrl: Boolean(ASAAS_API_URL),
                hasApiKey: Boolean(ASAAS_API_KEY),
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
                    successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/gifts/success`,
                    cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/gifts/cancel`,
                    expiredUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/gifts/expired`,
                },

                items: [
                    {
                        name: "Presente de casamento - M&H",
                        description: "Contribuição para o casamento",
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

        if (!data.id) {
            console.error("Asaas não retornou o ID do checkout:", data);

            return NextResponse.json(
                {
                    error: "Checkout não retornado pelo Asaas.",
                },
                { status: 500 },
            );
        }

        const checkoutUrl = `https://asaas.com/checkoutSession/show?id=${data.id}`;

        return NextResponse.json({
            id: data.id,
            checkoutUrl,
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