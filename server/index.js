import express from "express"
import * as dotenv from "dotenv"
import cors from "cors"
import connectDB from "./db/connect.js"
import Player from "./db/models/playerModel.js"
import Match from "./db/models/matchModel.js"
import mongoose, { Schema } from "mongoose"
import authRoutes from "./routes/authRoute.js"
import eventsRoutes from "./routes/eventsRoute.js"
import usersRoutes from "./routes/usersRoute.js"
import chatRoutes from "./routes/chatRoute.js"
import messageRoutes from "./routes/messageRoutes.js"

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
app.use("/api/chats",chatRoutes)
app.use("/api/message",messageRoutes)
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
