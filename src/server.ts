import { env } from "./config/env"
import { connectToDB } from "./config/db"
import app from "./app"

async function main() {
    await connectToDB()

    app.listen(env.PORT, () => {
        console.log(`Server is running on port ${env.PORT}`)
    })
}

main().catch((error) => {
    console.error("Failed to start:", error)
    process.exit(1)
})