import mongoose from "mongoose"

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
  matchJoined: {
    type: String,
    default: ""
  },
   friendsList:{
       type:Array,
      default:[]
    },
  
    //! match history = array of match score
    //? Future Plan, object {date , mode (1v1,2v2) , result(win or lose), score}
     matchHistory: {
       matchTitle:String,
       date:Date,
       //1 for 1v1 , 2 for 2v2
       gameMode:Number,
       //1 for win 0 for lose
       result:Number,
     },
  availability: {
    type: Boolean,
    default: true,
  },
})

const Player = mongoose.model("Player", userSchema, "players")

export default Player
