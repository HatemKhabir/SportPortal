import express from "express"
import { accessChat, createEventChat, fetchChats, fetchEventChat, deleteChat,addUserEventChat,removeFromEventChat } from "../controllers/chatController.js"
import { protect } from "../middleware/authMiddelware.js"
const router=express.Router()

router.get("/",protect,fetchChats)
router.post("/",protect,accessChat)
router.post("/eventChat",protect,createEventChat)
router.get("/eventChat",protect,fetchEventChat)
router.put("/eventChat/:userId/:eventId",protect,addUserEventChat)
router.delete("/eventChat/:userId/:eventId",protect,removeFromEventChat)



export default router