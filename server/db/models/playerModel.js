import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({

  username: {
    type: String,
    unique: true,
    required: true,
    lowercase:true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  reviews: {
    type: Map,
    default:{},
    of: String,
  },
  record: {
    Wins: Number,
    Losses: Number,
  },
  matchJoined: [{
    type: Schema.Types.ObjectId,
    ref:"Match",
    default: null
  }],
    //! match history = array of match score
    //? Future Plan, object {date , mode (1v1,2v2) , result(win or lose), score}
     
    /* matchHistory: {
       matchTitle:String,
       date:Date,
       //1 for 1v1 , 2 for 2v2
       gameMode:Number,
       //1 for win 0 for lose
       result:Number,
     }, */
  availability: {
    type: Boolean,
    default: true,
  },
})
userSchema.pre('save',async function functionName(next){
  if (!this.isModified)
    {next()}
  const salt=await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt)
}
)
userSchema.methods.matchPassword=async function(password){
  return await bcrypt.compare(password,this.password)
}
const Player = mongoose.model("Player", userSchema, "players")

export default Player
