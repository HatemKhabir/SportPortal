import express from "express"
import {addFriend, getProfile, getUsers, removeFriend,getFriendsList} from "../controllers/userController.js"

const router=express.Router();

router.get("/search-player",getUsers)
router.get("/profile",getProfile)
router.post("/addFriend",addFriend)
router.delete("/removeFriend",removeFriend)
router.get("/friendsList",getFriendsList);

export default router
