import type { Request, Response } from "express"
import { loginSchema, registerSchema } from "./auth.schema"
import * as authService from "./auth.service"
import { authCookieOptions } from "./token"
import { extractToken, getUser } from "./auth.middleware"



export async function registerController(req: Request, res: Response) {
    const input = registerSchema.parse(req.body)
    const { user, token } = await authService.registerUser(input)

    res.cookie("token", token, authCookieOptions)
    res.status(201).json({ user, token })
}

export async function loginController(req: Request, res: Response) {
    const input = loginSchema.parse(req.body)
    const { user, token } = await authService.loginUser(input)

    res.cookie("token", token, authCookieOptions)
    res.status(200).json({ user, token })
}

export async function logoutController(req: Request, res: Response) {
    const token = extractToken(req)

    if (token) {
        await authService.logoutUser(token)
    }

    const { maxAge: _maxAge, ...clearOptions } = authCookieOptions
    res.clearCookie("token", clearOptions)
    res.status(200).json({ message: "User logged out successfully" })
}

export async function meController(req: Request, res: Response) {
    const user = getUser(req)
    res.json({ user: { _id: user._id, email: user.email, name: user.name } })
}