import type { CookieOptions } from "express"
import { env } from "../../config/env"
import { createHash } from "node:crypto"
import jwt, { JwtPayload } from "jsonwebtoken"
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

interface TokenPayload extends JwtPayload {
    userId: string
}

export function verifyToken(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_SECRET)

    if (typeof decoded === "string" || typeof decoded.userId !== "string") {
        throw new jwt.JsonWebTokenError("invalid token payload")
    }

    return decoded as TokenPayload
}

export function hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex")
}