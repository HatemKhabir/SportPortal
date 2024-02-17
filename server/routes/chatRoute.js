import express from "express"
import { accessChat } from "../controllers/chatController.js"
const router=express.Router()

// router.get("/",fetchChat)
router.post("/",accessChat)
// router.post("/eventChat",createEventChat)
// router.put("/eventChatRemove",removeFromGroup)
// router.put("/eventChatAdd",addToGroup)



export default router