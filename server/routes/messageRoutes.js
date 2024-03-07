import express from "express"
import { sendMessage,getMessages } from "../controllers/messagingController.js";
import { protect } from "../middleware/authMiddelware.js";

const router=express.Router()

router.post("/",protect,sendMessage);
router.get("/",protect,getMessages);


export default router;