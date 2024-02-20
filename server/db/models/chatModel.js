import mongoose, { Schema } from "mongoose";
const chatSchema = mongoose.Schema(
  {
    eventId:{
      type:String,
      ref:"Match",
      unique:true,
      default:null
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    //array of users
    users: [{ type: Schema.Types.ObjectId, ref: "Player" }],
    chat: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    latestMsg: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema, "Chats");
export default Chat;
