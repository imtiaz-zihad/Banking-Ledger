import mongoose from "mongoose"
import { connectToDB } from "./config/db"
import userModel from "./modules/user/user.model"

async function run() {
    await connectToDB()

    const user = await userModel.create({
        email: " Test@Example.com ",
        name: "Test",
        password: "password123",
    })
    console.log("email:", user.email)
    console.log("password:", user.password)

    const found = await userModel.findOne({ email: "test@example.com" })
    console.log("without select:", found?.password)

    const withPassword = await userModel.findOne({ email: "test@example.com" }).select("+password")
    console.log("right:", await withPassword?.comparePassword("password123"))
    console.log("wrong:", await withPassword?.comparePassword("wrong"))

    await userModel.deleteMany({ email: "test@example.com" })
    await mongoose.disconnect()
}

run().catch(console.error)