import mongoose from "mongoose";
import Chat from "../db/models/chatModel.js";
import Message from "../db/models/messageModel.js"

export const sendMessage=async(req,res)=>{
    const {chatId,messageContent,senderID}=req.body
    if (!chatId || !messageContent){
        return res.status(403).json({message:"Invalid Data Sent"})
    }
    try{
    
    let newMessage={
        senderID:senderID,
        content:messageContent,
        chat:chatId
    }
    let message=await Message.create(newMessage)
    await Message.populate(message,[{path:"senderID",select :"username"},{path:"chat"}])
    const findChat=await Chat.findOneAndUpdate({_id:chatId},{latestMsg:message})
    await Chat.populate(findChat,"latestMsg","content")
    console.log(findChat)
    if(message&&findChat)
    return res.status(201).json({message:"message Sent"});
    return res.status(403).json({message:"something wwong happend"})
    }catch(e){
        console.log(e)
        return res.status(503).json({message:e.message})
    }



}