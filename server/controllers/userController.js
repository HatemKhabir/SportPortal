import mongoose from "mongoose";
import Player from "../db/models/Player.js";
import friendShip from "../db/models/Friendships.js";

export const getUsers=async(req,res)=>{
try{
    const searchQuery=req.query.q;
    const users=await Player.find({username:{ $regex: new RegExp(searchQuery, "i")}});
    res.json(users)
}catch(err){
    console.log(err);
   res.status(500).json({message:"Internal Server Error"}); 
};
}

export const getProfile=async(req,res)=>{
    try{
const username=req.query.id;
const user=await Player.findOne({username:username})
const friendShips=await friendShip.find({$or:[{friendA:user._id},{friendB:user._id}]});
const responseData={
    profileData:{
    _id:user._id,
    reviews:user.reviews,
    availability:user.availability,
    record:user.record,
},
friendShips:friendShips
}

return res.status(201).json(responseData);

    }catch(error){
        console.log(error);
       return res.status(500).json({message:"Internal Server Error"})
    }
}
/*The block with curly braces {} creates a block of code without an implicit return statement. 
Therefore, the arrow function doesn't return a value, and the filter function interprets this as a filtering criterion that is never met. 
As a result, it effectively filters out all elements from the array, leaving you with an empty array.
To fix this issue, you should either use an explicit return statement within the arrow function's block or remove the curly braces to make it an implicit return statement. Here's how you can do it:
Option 1: Using an explicit return statement:
const loggedinList = user.friendsList.filter((username) => {
  return username !== friendToRemove;
});
or do same as done below : */
export const removeFriend=async(req,res)=>{
    try {
        const friendToRemove=req.query.friendToRemove
        const loggedInUsername=req.query.loggedInUsername
        
        const friend=await Player.findOne({username:friendToRemove})
        const user=await Player.findOne({username:loggedInUsername})
        
        if (user.friendsList.includes(friend.username)){
            const newList=friend.friendsList.filter((username)=>{
                return username!==loggedInUsername})
            friend.friendsList=newList
            const loggedinList=user.friendsList.filter((username)=>username!==friendToRemove)
            user.friendsList=loggedinList
            await friend.save()
            await user.save()
            return res.status(200).json("Success");
        }
        else{
        return res.status(400).json("Failed")
        }
        }
    catch (error) {
        console.log(error)
        res.status(500).json({message:"Internal Server Error "})
    }
}
export const addFriend=async(req,res)=>{
    try{
const {loggedinUsername,friendToAdd}=req.body;
const user=await Player.findOne({username:loggedinUsername});
const friend=await Player.findOne({username:friendToAdd});
const friendRelation=await friendShip.find({
    $or:[{friendA:user._id},{friendB:user._id}],
    $or:[{friendA:friend._id},{friendB:friend._id}]
})
console.log(friendRelation)
if (friendRelation.length!==0){
    return res.status(201).json("Already Friends");
}
const newFriendShip=new friendShip({
friendA:user._id,
friendB:friend._id,
pendingStatus:true
})
try{
    await newFriendShip.save();
    console.log(await friendShip.find());
}catch(err){
    console.log(err)
    return res.status(500).json({message:"Internal Server Error"})
}
return res.status(201).json("Friend Added");
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const getFriendsList=async (req,res)=>{
    try{
        const loggedInUsername=req.query.username;
        const user=await Player.findOne({username:loggedInUsername});
        const friends=await friendShip.find({
            $or:[{friendA:user._id},{friendB:user._id}],
            pendingStatus:false
        })
        if (friends!=null)
        {
           console.log(friends)
            return res.status(201).json(friends);
        }
    else return res.status(201).json("get yourself some friends first ")
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Something Went Wrong ! "});
    }

}
