import mongoose,{Schema} from "mongoose";

const messagesSchema=mongoose.Schema({
    senderID:{
        type : Schema.Types.ObjectId,
        ref:'Player'
    },
    receipientID:{
        type:Schema.Types.ObjectId,
        ref:'Player'
    },
    content:String,
    timestamp:Date
})

const Message=mongoose.Model("Messages",messagesSchema,"messages")

export default Message