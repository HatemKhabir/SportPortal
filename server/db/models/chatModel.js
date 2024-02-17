import mongoose, { Schema } from "mongoose";
const chatSchema = mongoose.Schema(
  {
    isGroupChat: {
      type: Boolean,
      default: false,
    },
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
