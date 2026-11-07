import type { CookieOptions } from "express"
import jwt from "jsonwebtoken"
import { env } from "../../config/env"

const TOKEN_TTL_MS = 3 * 24 * 60 * 60 * 1000

export function signToken(userId: string): string {
    return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "3d" })
}

export const authCookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: TOKEN_TTL_MS,
}