import express from "express"
import {addFriend, getProfile, getUsers, removeFriend,getFriendsList,acceptFriendship, declineFriendship} from "../controllers/userController.js"

const router=express.Router();

router.get("/search-player",getUsers)
router.get("/profile",getProfile)
router.post("/addFriend",addFriend)
router.delete("/removeFriend",removeFriend)
router.get("/friendsList",getFriendsList);
router.patch("/addFriend",acceptFriendship)
router.delete("/addFriend",declineFriendship)
export default router
