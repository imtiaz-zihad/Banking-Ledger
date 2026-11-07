import mongoose, { HydratedDocument, Model, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser {
    email: string
    name: string
    password: string
    systemUser: boolean
    createdAt: Date
    updatedAt: Date
}

export interface IUserMethods {
    comparePassword(password: string): Promise<boolean>
}

export type UserModel = Model<IUser, {}, IUserMethods>
export type UserDocument = HydratedDocument<IUser, IUserMethods>

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email address"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"],
        select: false,
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false,
    },
}, {
    timestamps: true,
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return
    }

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (this: UserDocument, password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password)
}

const userModel = mongoose.model<IUser, UserModel>("user", userSchema)

export default userModel