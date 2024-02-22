import mongoose,{Schema} from "mongoose";

const messagesSchema=mongoose.Schema({
    senderID:{
        type : Schema.Types.ObjectId,
        ref:'Player'
    },
    content:{
        type:String,
        trim:true },
    chat:{
        type :Schema.Types.ObjectId,
        ref:"Chat"
    },
},{timestamps:true})


const Message=mongoose.model("Messages",messagesSchema,"messages")

export default Message