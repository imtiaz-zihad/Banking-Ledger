import "dotenv/config"

function required(name: string): string {
    const value = process.env[name]

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }

    return value
}

export const env = {
    PORT: Number(process.env.PORT) || 3000,
    MONGO_URI: required("MONGO_URI"),
    JWT_SECRET: required("JWT_SECRET"),
}