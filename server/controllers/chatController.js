import mongoose from "mongoose";
import Chat from "../db/models/chatModel.js";
import Player from "../db/models/playerModel.js"
import Match  from "../db/models/matchModel.js"



/////////////////////////////////////////either initialize a new chat or access old one between 2 users 
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
/////////////////////////////////////////return all chats for an user 
export const fetchChats=async(req,res)=>{
  const loggedInUser = req.query.loggedInUser; // Use req.query for query parameters
  try{
const userChats=await Chat.find({
  users:{$elemMatch:{$eq:loggedInUser}}
})
if (!userChats){
  var populatedChats=await Chat.populate(userChats,[
    {path:"users",select:"username"},
    {path:"latestMsg"},
    {path:"eventId",select:"eventTitle"}
  ])
  const sortedChats=populatedChats.sort((a, b) => b.updatedAt - a.updatedAt)
  return res.status(201).json(sortedChats)
}else return res.status(201).json({message:"No Chats Found"})
}catch(err){
return res.status(500).json({message:err.message})
}
}
/////////////////////////////////////////initialize a new event chat after creation 

export const createEventChat=async(req,res)=>{
  const {eventId,loggedInUser}=req.body;
  try{
  const matchId=await Match.findOne({matchID:eventId});
  const foundChat=await Chat.findOne({eventId:matchId._id});
  if (!foundChat){    
    let newChat=await Chat.create({eventId:matchId._id,isGroupChat:true,users:[loggedInUser]})
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
/////////////////////////////////////////Fetch an event chat after clicking the event infos

export const fetchEventChat=async(req,res)=>{
const {eventId}=req.body;
try{
  let eventFound=await Match.findOne({matchID:eventId}).select("_id")

  if (eventFound)
  {let chatFound=await Chat.find({eventId:eventFound._id,isGroupChat:true}).populate("users","username").populate("eventId","eventTitle")
  if (chatFound.length>0)
  return res.status(200).json(chatFound)}
}catch(e){
  return res.status(503).json({message:e.message})
}
}

/////////////////////////////////////////Deleting a chat either group or personal

export const deleteChat=async(req,res)=>{
  const chatId=req.query.chatId;
  try{
    const findChat=await Chat.findOne({_id:chatId})
    if (findChat)
  {const deletedChat=await Chat.findOneAndDelete({_id:chatId})
  if (deletedChat)
  return res.status(200).json({message:"Chat Deleted !"})
  }else return res.status(404).json({message:"something went wrong"})
  return res.status(200).json({message:"Event Chat not Found"})
  }catch(e){
    console.log(e);
    return res.status(503).json({message:e.message})
  }
}
/////////////////////////////////////////add user to an event chat (by him joining the event)

export const addUserEventChat=async(req,res)=>{
const userId=req.params.userId
const eventId=req.params.eventId
try{
  const modifiedEventChat=await Chat.findOneAndUpdate({eventId:eventId},{$addToSet:{users:userId}},{new:true}).populate("users","username").populate("eventId","eventTitle")
 if (!modifiedEventChat)
return res.status(403).json({message:"Event Chat Not Found !"})
else return res.status(200).json(modifiedEventChat) 

}catch(e){
return res.status(503).json({message:e.message})
}
}
/////////////////////////////////////////remove user from an event chat (by him leaving the event)
export const removeFromEventChat=async(req,res)=>{

  const userId=req.params.userId
  const eventId=req.params.eventId
  try{
    const modifiedEventChat=await Chat.findOneAndUpdate({eventId:eventId},{$pull:{users:userId}},{new:true}).populate("users","username")
  
  if (!modifiedEventChat)
  return res.status(403).json({message:"Event Chat Not Found !"})
  else return res.status(200).json(modifiedEventChat)
  
  }catch(e){
  return res.status(503).json({message:e.message})
  }
  }