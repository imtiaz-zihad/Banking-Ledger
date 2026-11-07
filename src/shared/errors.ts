export class AppError extends Error {
    constructor(
        public readonly statusCode: number,
        message: string,
        public readonly code?: string,
    ) {
        super(message)
        this.name = "AppError"
    }
}

export function isDuplicateKeyError(error: unknown): boolean {
    return typeof error === "object" && error !== null && (error as { code?: unknown }).code === 11000
}