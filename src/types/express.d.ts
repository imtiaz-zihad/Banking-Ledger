import type { UserDocument } from "../modules/user/user.model"

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument
        }
    }
}

export {}