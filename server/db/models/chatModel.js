import mongoose, { Schema } from "mongoose";
const chatSchema = mongoose.Schema(
  {
    eventId:{
      type:Schema.Types.ObjectId,
      ref:"Match",
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    //array of users
    users: [{ type: Schema.Types.ObjectId, ref: "Player" }],
    /* future plan of storing newer messages here for ease of acceess in fetching 
    chat: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    */latestMsg: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema, "Chats");
export default Chat;
