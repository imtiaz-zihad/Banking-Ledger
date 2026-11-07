import type { Request, Response } from "express"
import { loginSchema, registerSchema } from "./auth.schema"
import * as authService from "./auth.service"
import { authCookieOptions } from "./token"

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