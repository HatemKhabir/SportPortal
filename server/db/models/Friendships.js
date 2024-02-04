import mongoose,{Mongoose, Schema} from "mongoose";

const friendShipSchema=mongoose.Schema({
    friendA:{
        type:Schema.Types.ObjectId,
        ref:'Player'
    },
    friendB:{
        type:Schema.Types.ObjectId,
        ref:'Player'
    },
    pendingStatus:{
        type:Boolean,
        default:false
    }
})

const friendShip=Mongoose.Model("friendShipS",friendShipSchema,"friends");

export default friendShip