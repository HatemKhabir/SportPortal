import mongoose from "mongoose";
import Chat from "../db/models/chatModel.js";
import Player from "../db/models/playerModel.js"


export const accessChat=async(req,res)=>{
    const {userId,loggedInUser}=req.body
    if (!userId)
    return res.status(400).json({message:"UserId doesn't exist"})
  try{
    let chatFound=await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:loggedInUser}}},
            {users:{$elemMatch:{$eq:userId}}} 
        ],
    }).populate("users","-password").populate("latestMsg")
   chatFound=await Player.populate(chatFound,{path:"latestMsg.sender",select:"username"})
   if(chatFound.length>0){
    return res.status(200).json(chatFound);
   }else{
    const newChatData={
        isGroupChat:false,
        users:[loggedInUser,userId]
    }
    const chatCreated=await Chat.create(newChatData)
    await Chat.populate(chatCreated, { path: "users", select: "-password" });
    res.status(200).json(chatCreated)
   }
  }catch(err){
    return res.status(503).json({message:err.message})
  }
}