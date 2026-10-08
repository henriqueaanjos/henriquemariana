import { cookies } from "next/headers";
import {
    createHash,
    createHmac,
    timingSafeEqual,
} from "crypto";

export const SESSION_COOKIE = "admin_session";

function getSessionSecret() {
    const secret =
        process.env.ADMIN_SESSION_SECRET;

    if (!secret) {
        throw new Error(
            "ADMIN_SESSION_SECRET não configurado."
        );
    }

    return secret;
}

export function hashPassword(
    password: string
) {
    return createHash("sha256")
        .update(password, "utf8")
        .digest("hex");
}

export function verifyPassword(
    password: string
) {
    const passwordHash = hashPassword(password);

    const expectedHash =
        process.env.ADMIN_PASSWORD_SHA256;

    if (!expectedHash) {
        throw new Error(
            "ADMIN_PASSWORD_SHA256 não configurado."
        );
    }

    if (
        passwordHash.length !==
        expectedHash.length
    ) {
        return false;
    }

    return timingSafeEqual(
        Buffer.from(passwordHash),
        Buffer.from(expectedHash)
    );
}

export function createAdminSession() {
    const timestamp = Date.now().toString();

    const signature = createHmac(
        "sha256",
        getSessionSecret()
    )
        .update(timestamp)
        .digest("hex");

    return `${timestamp}.${signature}`;
}

export function verifyAdminSession(
    token: string | undefined
) {
    if (!token) {
        return false;
    }

    const [timestamp, signature] =
        token.split(".");

    if (!timestamp || !signature) {
        return false;
    }

    if (!/^\d+$/.test(timestamp)) {
        return false;
    }

    const expectedSignature = createHmac(
        "sha256",
        getSessionSecret()
    )
        .update(timestamp)
        .digest("hex");

    if (
        signature.length !==
        expectedSignature.length
    ) {
        return false;
    }

    const validSignature =
        timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        );

    if (!validSignature) {
        return false;
    }

    const sessionAge =
        Date.now() - Number(timestamp);

    const maxAge =
        1000 * 60 * 60 * 24;

    return (
        sessionAge >= 0 &&
        sessionAge < maxAge
    );
}


export async function requireAdminSession() {
    const cookieStore = await cookies();

    const token = cookieStore.get(
        SESSION_COOKIE,
    )?.value;

    const isValid =
        verifyAdminSession(token);

    if (!isValid) {
        return false;
    }

    return true;
}