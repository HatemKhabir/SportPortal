import express from "express"
import {addFriend, getProfile, getUsers, removeFriend,getFriendsList,acceptFriendship, declineFriendship} from "../controllers/userController.js"
import { protect } from "../middleware/authMiddelware.js";

const router=express.Router();

router.get("/search-player",protect,getUsers)
router.get("/profile",protect,getProfile)
router.post("/addFriend",protect,addFriend)
router.delete("/removeFriend",protect,removeFriend)
router.get("/friendsList",protect,getFriendsList);
router.patch("/addFriend",protect,acceptFriendship)
router.delete("/addFriend",protect,declineFriendship)
export default router
