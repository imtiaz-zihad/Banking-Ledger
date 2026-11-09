import type { Request, RequestHandler } from "express"
import { AppError } from "../../shared/errors"
import userModel, { UserDocument } from "../user/user.model"
import tokenBlackListModel from "./blacklist.model"
import { hashToken, verifyToken } from "./token"

export function extractToken(req: Request): string | undefined {
    const cookieToken: unknown = req.cookies?.token
    if (typeof cookieToken === "string" && cookieToken) {
        return cookieToken
    }

    const [scheme, bearerToken] = req.headers.authorization?.split(" ") ?? []
    if (scheme?.toLowerCase() === "bearer" && bearerToken) {
        return bearerToken
    }

    return undefined
}

const invalidToken = () => new AppError(401, "Unauthorized access, token is invalid")

function authenticate({ systemOnly = false } = {}): RequestHandler {
    return async (req, _res, next) => {
        const token = extractToken(req)

        if (!token) {
            throw new AppError(401, "Unauthorized access, token is missing")
        }

        if (await tokenBlackListModel.exists({ tokenHash: hashToken(token) })) {
            throw invalidToken()
        }

        let userId: string
        try {
            userId = verifyToken(token).userId
        } catch {
            throw invalidToken()
        }

        const user = await userModel.findById(userId).select("+systemUser")

        if (!user) {
            throw invalidToken()
        }

        if (systemOnly && !user.systemUser) {
            throw new AppError(403, "Forbidden access, not a system user")
        }

        req.user = user
        next()
    }
}

export const authMiddleware = authenticate()
export const authSystemUserMiddleware = authenticate({ systemOnly: true })

export function getUser(req: Request): UserDocument {
    if (!req.user) {
        throw new AppError(401, "Unauthorized access, token is missing")
    }
    return req.user
}