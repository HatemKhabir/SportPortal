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
import {Server} from "socket.io"
import Chat from "./db/models/chatModel.js"
import { errorHandler, notFound } from "./middleware/errorMiddelware.js"
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
app.use(notFound)
app.use(errorHandler)
const startServer = async () => {
  try {
    const server=app.listen(port, () => console.log(`server has started on port ${port}`))
    connectDB(process.env.ATLAS_URI)
    const io=new Server(server,{
      pingTimeout:60000, 
      cors:{
        origin:"http://localhost:5173"
      }
    })
    io.on("connect", (socket) => {
      console.log(`User Connected: ${socket.id}`)
      
      socket.on("setup",(userData)=>{
        socket.join(userData)
        socket.emit("connected")
    })
    socket.on("join chat",(chatId)=>{
      socket.join(chatId)
      console.log("user joined ",chatId)
    })
    
    socket.on("new message",async(newMessageReceived)=>{
      var chat=await Chat.findById(newMessageReceived.data.chat)
      if (!chat.users) return console.log("bad chat id");
      chat.users.forEach(user=>{
        if (user==newMessageReceived.data.senderID) return;
        socket.in(user).emit("message recieved",newMessageReceived) 
        console.log(socket.in(user))
        console.log("message emitted")
      })
    })

  }
  )

  } catch (e) {
    console.log(e)
  }
}
startServer()
