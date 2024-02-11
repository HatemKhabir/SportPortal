import express from "express"
import * as dotenv from "dotenv"
import cors from "cors"
import connectDB from "./db/connect.js"
import Player from "./db/models/Player.js"
import Match from "./db/models/Match.js"
import mongoose, { Schema } from "mongoose"
import authRoutes from "./routes/authRoute.js"
import eventsRoutes from "./routes/eventsRoute.js"
import usersRoutes from "./routes/usersRoute.js"

dotenv.config()

const port = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())

//---------------------------------------------------------------------------------------    SIGNUP & LOGIN       -----------------------------------------------------------------------------------
app.use("/auth", authRoutes)
//---------------------------------------------------------------------------------------    CREATE&JOIN MATCH    --------------------------------------------------------------------------------
app.use("/api/events", eventsRoutes)
app.use("/api/users",usersRoutes)
//----------------------------------------------------------------------------------------  Testing APIS-----------------------------------------------------------------------------------

const startServer = async () => {
  try {
    app.listen(port, () => console.log(`server has started on port ${port}`))
    connectDB(process.env.ATLAS_URI)
  } catch (e) {
    console.log(e)
  }
}
startServer()
