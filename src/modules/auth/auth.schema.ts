import { z } from "zod"

const email = z.string().trim().toLowerCase().pipe(z.email("Invalid email address"))

export const registerSchema = z.object({
    email,
    name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password must be at most 72 characters"),
})

export const loginSchema = z.object({
    email,
    password: z.string().min(1, "Password is required"),
})