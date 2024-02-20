import mongoose from "mongoose";
import Chat from "../db/models/chatModel.js";
import Player from "../db/models/playerModel.js"
import Match  from "../db/models/matchModel.js"

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
    //show the latest message sender username
   chatFound=await Chat.populate(chatFound,{path:"latestMsg.sender",select:"username"})
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

export const fetchChats=async(req,res)=>{
const {loggedInUser}=req.body
  try{
const userChats=await Chat.find({
  users:{$elemMatch:{$eq:loggedInUser}}
})
  await Chat.populate(userChats,[
    {path:"users",select:"username"},
    {path:"latestMsg"},
    {path:"eventId",select:"eventTitle"}
]).sort({updatedAt:-1})
res.status(201).json(userChats)
}catch(err){
res.status(500).json({message:err.message})
}

}

export const createEventChat=async(req,res)=>{
  const {eventId,loggedInUser}=req.body;
  try{
  const foundChat=await Chat.findOne({eventId:eventId});
  if (!foundChat){    
    let newChat=await Chat.create({eventId:eventId,isGroupChat:true,users:[loggedInUser]})
    await Chat.populate(newChat,[{path:"users",select:"username"},
    {path:"eventId"}])
    if (newChat)
    return res.status(200).json(newChat)
  else  return res.status(200).json({message:"Match Not Found"}) 
}else return res.status(200).json({message:"Match Convo Already Exists"})
}catch(err){
  console.log(err);
    return res.status(503).json({message:err.message})
  }
}

export const fetchEventChat=async(req,res)=>{
const {eventId}=req.body;
try{
  let eventFound=await Match.findOne({matchID:eventId}).select("_id")
  if (eventFound)
  {let chatFound=await Chat.find({eventId:eventFound._id,isGroupChat:true}).populate("users","username").populate("eventId").populate("chat")
  if (chatFound.length>0)
  return res.status(200).json(chatFound)}
}catch(e){
  return res.status(503).json({message:e.message})
}
}