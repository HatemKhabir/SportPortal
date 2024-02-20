import express from "express"
import { accessChat, createEventChat, fetchChats, fetchEventChat } from "../controllers/chatController.js"
const router=express.Router()

router.get("/",fetchChats)
router.post("/",accessChat)
router.post("/eventChat",createEventChat)
router.get("/eventChat",fetchEventChat)
// router.put("/eventChatRemove",removeFromGroup)
// router.put("/eventChatAdd",addToGroup)



export default router