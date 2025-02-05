import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
import authRoutes from "./routes/authRoutes.js"
import appRoutes from "./routes/appRoutes.js"

const app = express()
const port  = process.env.PORT || 5000

//Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
//Get the directory name from the file path
const __dirname = dirname(__filename)

//Middleware


// Bodyparser middleware to parse JSON request bodies
app.use(express.json())

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")))

app.use("/auth", authRoutes)
app.use("/todos", appRoutes)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"))
})



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})