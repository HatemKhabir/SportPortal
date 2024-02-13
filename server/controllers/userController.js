import mongoose from "mongoose";
import Player from "../db/models/playerModel.js";
import friendShip from "../db/models/friendRelationModel.js";

export const getUsers = async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const users = await Player.find({
      username: { $regex: new RegExp(searchQuery, "i") },
    });
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

async function getUserId(username) {
  try {
    const player = await Player.findOne({ username: username });
    return player ? player._id : null;
  } catch (error) {
    console.error(error);
  }
}

export const getProfile = async (req, res) => {
  try {
    const username = req.query.id;
    const user = await Player.findOne({ username: username });
    const friendShips = await friendShip.find({
      $or: [{ sender: user._id }, { recipient: user._id }],
    });
    const responseData = {
      profileData: {
        _id: user._id,
        reviews: user.reviews,
        availability: user.availability,
        record: user.record,
      },
      friendShips: friendShips,
    };

    return res.status(201).json(responseData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
/*The block with curly braces {} creates a block of code without an implicit return statement. 
Therefore, the arrow function doesn't return a value, and the filter function interprets this as a filtering criterion that is never met. 
As a result, it effectively filters out all elements from the array, leaving you with an empty array.
To fix this issue, you should either use an explicit return statement within the arrow function's block or remove the curly braces to make it an implicit return statement. Here's how you can do it:
Option 1: Using an explicit return statement:
const loggedinList = user.friendsList.filter((username) => {
  return username !== friendToRemove;
});
or do same as done below : */
export const removeFriend = async (req, res) => {
  try {
    const [friendToRemove, loggedInUsername] = await Promise.all([
      getUserId(req.query.friendToRemove),
      getUserId(req.query.loggedInUsername),
    ]);
    const friendship = await friendShip.findOneAndDelete({
      $or: [
        { sender: friendToRemove, recipient: loggedInUsername },
        { sender: loggedInUsername, recipient: friendToRemove },
      ],
    });

    if (friendship) {
      return res.status(200).json("Success");
    } else {
      return res.status(501).json("Failed");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error " }, error);
  }
};
export const addFriend = async (req, res) => {
  try {
    const { loggedinUsername, friendToAdd } = req.body;
    const [user, friend] = await Promise.all([
      Player.findOne({ username: loggedinUsername }),
      Player.findOne({ username: friendToAdd })
    ]
    );

    const friendRelation = await friendShip.find({
      $or: [{ sender: user._id,recipient: user._id },
       { sender: friend._id,recipient: friend._id }],
    });
    const friends = await friendShip.find();
    console.log("friends ", friends);
    console.log();
    console.log(friendRelation);
    if (friendRelation.length !== 0) {
      return res.status(201).json("Already Friends");
    }
    const newFriendShip = new friendShip({
      sender: user._id,
      recipient: friend._id,
      pendingStatus: true,
    });
    try {
      await newFriendShip.save();
      console.log(await friendShip.find());
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
    return res.status(201).json("Friend Added");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getFriendsList = async (req, res) => {
  try {
    const loggedInUsername = req.query.username;
    const user = await Player.findOne({ username: loggedInUsername });
    const friends = await friendShip.find({
      $or: [{ sender: user._id }, { recipient: user._id }],
      pendingStatus: false,
    });
    if (friends.length > 0) {
      // Populate sender or recipient details for each friendship
      const friendsList = await Promise.all(
        friends.map(async (friendship) => {
          if (friendship.sender.equals(user._id)) {
            return await friendship.populate('recipient');
          } else {
            return await friendship.populate('sender');
          }
        })
      );

      return res.status(200).json(friendsList);
    } else {
      return res.status(200).json([]);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
};
export const acceptFriendship = async (req, res) => {
  try {
    const friendA = await getUserId(req.body.friend1);
    const friendB = await getUserId(req.body.friend2);

    const updatedFriendship = await friendShip.findOneAndUpdate(
      { recipient: friendB, sender: friendA },
      { $set: { pendingStatus: false } },
      { new: true } // This option ensures that the updated document is returned
    );
    if (updatedFriendship) {
      await updatedFriendship.save();
      return res
        .status(201)
        .json({ message: "friendShipAccepted", updatedFriendship });
    } else {
      return res.status(500).json({ message: "Friendship not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Wrong!" });
  }
};

export const declineFriendship = async (req, res) => {
  try {
    const friendA = await getUserId(req.query.friend1);
    const friendB = await getUserId(req.query.friend2);

    const updatedFriendship = await friendShip.findOneAndDelete(
      { recipient: friendB, sender: friendA },
      { new: true } // This option ensures that the updated document is returned
    );
    if (updatedFriendship) {
      return res
        .status(201)
        .json({ message: "friendship Removed", updatedFriendship });
    } else {
      return res.status(500).json({ message: "Friendship not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
