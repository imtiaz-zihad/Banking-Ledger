import userModel, { UserDocument } from "../user/user.model"
import { AppError, isDuplicateKeyError } from "../../shared/errors"
import type { LoginInput, RegisterInput } from "./auth.schema"
import { signToken } from "./token"

function toPublicUser(user: UserDocument) {
    return { _id: user._id, email: user.email, name: user.name }
}

export async function registerUser(input: RegisterInput) {
    const user = await userModel.create(input).catch((error: unknown) => {
        if (isDuplicateKeyError(error)) {
            throw new AppError(422, "User already exists with email.")
        }
        throw error
    })

    return { user: toPublicUser(user), token: signToken(user._id.toString()) }
}

export async function loginUser({ email, password }: LoginInput) {
    const user = await userModel.findOne({ email }).select("+password")

    if (!user || !(await user.comparePassword(password))) {
        throw new AppError(401, "Email or password is INVALID")
    }

    return { user: toPublicUser(user), token: signToken(user._id.toString()) }
}