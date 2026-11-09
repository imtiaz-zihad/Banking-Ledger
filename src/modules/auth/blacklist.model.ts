import mongoose, { Schema } from "mongoose"

export interface ITokenBlackList {
    tokenHash: string
    createdAt: Date
}

const schema = new Schema<ITokenBlackList>({
    tokenHash: { type: String, required: true, unique: true },
}, {
    timestamps: { createdAt: true, updatedAt: false },
})

schema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 3 })

export default mongoose.model<ITokenBlackList>("tokenBlackList", schema)