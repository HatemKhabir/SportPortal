import mongoose,{ Schema} from "mongoose";

const friendShipSchema=mongoose.Schema({
    sender:{
        type:Schema.Types.ObjectId,
        ref:'Player'
    },
    recipient:{
        type:Schema.Types.ObjectId,
        ref:'Player'
    },
    pendingStatus:{
        type:Boolean,
        default:false
    }
})

const friendShip=mongoose.model("friendShip",friendShipSchema,"friends");

export default friendShip