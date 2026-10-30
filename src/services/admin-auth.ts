
import { cookies } from "next/headers";
import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "crypto";

export const SESSION_COOKIE = "admin_session";

export type UserRole = "admin" | "cerimonial";

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET não configurado.");
  }

  return secret;
}

export function hashPassword(password: string) {
  return createHash("sha256")
    .update(password, "utf8")
    .digest("hex");
}

function verifyPasswordHash(
  password: string,
  expectedHash: string | undefined,
) {
  if (!expectedHash || !/^[a-f0-9]{64}$/i.test(expectedHash)) {
    return false;
  }

  const passwordHash = hashPassword(password);

  return timingSafeEqual(
    Buffer.from(passwordHash, "hex"),
    Buffer.from(expectedHash, "hex"),
  );
}

export function verifyPassword(password: string) {
  return verifyPasswordHash(
    password,
    process.env.ADMIN_PASSWORD_SHA256,
  );
}

export function verifyCerimonialPassword(password: string) {
  return verifyPasswordHash(
    password,
    process.env.CERIMONIAL_PASSWORD_SHA256,
  );
}

function signSession(role: UserRole, timestamp: string) {
  return createHmac("sha256", getSessionSecret())
    .update(`${role}.${timestamp}`)
    .digest("hex");
}

export function createSession(role: UserRole) {
  const timestamp = Date.now().toString();
  const signature = signSession(role, timestamp);

  return `v1.${role}.${timestamp}.${signature}`;
}

// Mantém compatibilidade com chamadas existentes.
export function createAdminSession() {
  return createSession("admin");
}

export function getSessionRole(
  token: string | undefined,
): UserRole | null {
  if (!token) return null;

  const [version, role, timestamp, signature] = token.split(".");

  if (
    version !== "v1" ||
    (role !== "admin" && role !== "cerimonial") ||
    !timestamp ||
    !signature ||
    !/^\d+$/.test(timestamp) ||
    !/^[a-f0-9]{64}$/i.test(signature)
  ) {
    return null;
  }

  const expectedSignature = signSession(role, timestamp);

  const validSignature = timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(expectedSignature, "hex"),
  );

  if (!validSignature) return null;

  const sessionAge = Date.now() - Number(timestamp);
  const maxAge = 1000 * 60 * 60 * 24;

  if (sessionAge < 0 || sessionAge >= maxAge) {
    return null;
  }

  return role;
}

export function verifyAdminSession(token: string | undefined) {
  return getSessionRole(token) === "admin";
}

export function verifyCerimonialSession(token: string | undefined) {
  return getSessionRole(token) === "cerimonial";
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  return verifyAdminSession(token);
}

export async function requireCerimonialSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  return verifyCerimonialSession(token);
}
