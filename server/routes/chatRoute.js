import express from "express"
import { accessChat, createEventChat, fetchChats, fetchEventChat, deleteChat,addUserEventChat,removeFromEventChat } from "../controllers/chatController.js"
const router=express.Router()

router.get("/",fetchChats)
router.post("/",accessChat)
router.post("/eventChat",createEventChat)
router.get("/eventChat",fetchEventChat)
router.put("/eventChat/:userId/:eventId",addUserEventChat)
router.delete("/eventChat/:userId/:eventId",removeFromEventChat)



export default router