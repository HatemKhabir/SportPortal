import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import Modal from "../components/Modal";
import friendShip from "../../../server/db/models/friendRelationModel.js";
import { sendMessage } from "../../../server/controllers/messagingController.js";
import { useNavigate } from "react-router-dom";

function PlayerProfile() {
  const location = useLocation();
  const urlQuery = new URLSearchParams(location.search);
  const username = urlQuery.get("id");
  const [recipientUser, setRecipient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [availabality, setAvailablity] = useState(false);
  const [record, setRecord] = useState({ Wins: 0, Losses: 0 });
  const [ loggedInUsername] = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  //useContext(UserContext) returns an object, and by using destructuring, you can extract the loggedInUsername property from that object directly.
  const [alreadyFriends, setAlreadyFriends] = useState(false);
  const [invitePending, setInvitePending] = useState(false);
  const navigate=useNavigate();
  async function fetchUserData(value) {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/users/profile?id=${value}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      

      return response.data;
    } catch (error) {
      alert("errors fetching user data",error);
      return [];
    }
  }

  const handleAdd = async (username) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/users/addFriend`,
        {
          loggedinUsername: loggedInUsername,
          friendToAdd: username,
        },
        { headers: { "Content-Type": "application/json",
        Authorization:`Bearer ${localStorage.getItem("authToken")}`
       } }
      );
      console.log(response);
      setAlreadyFriends(true)
      setInvitePending(true);
      setModalMessage("Invite Sent !");
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage(error);
      setIsModalOpen(true);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };


  //in delete request you cant use request body like post or put instead use queries
  const handleDelete = async (username) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/users/removeFriend`,
        {
          params: {
            friendToRemove: username,
            loggedInUsername: loggedInUsername
          },headers:{
          Authorization:`Bearer ${localStorage.getItem("authToken")}`
          }
        }
      );
      if (response.status == 200) setAlreadyFriends(false);
      setModalMessage("Friend Deleted !");
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage(error.response.message);
      setIsModalOpen(true);
    }
  };

  const declineFriendship=async(username)=>{
try {
  const response = await axios.delete(`http://localhost:8080/api/users/addFriend`, {
    params: {
      friend1: username,
      friend2: loggedInUsername
    },headers:{
      Authorization:`Bearer ${localStorage.getItem("authToken")}`
    }
  });
  setAlreadyFriends(false)
  console.log(response)
} catch (error) {
  console.log(error.response.data);
  setIsModalOpen(true)
}
}

  const acceptFriendship = async (username) => {
    try {
      const requestData = {
        friend1: username,
        friend2: loggedInUsername,
      };

      const response = await axios.patch(
        "http://localhost:8080/api/users/addFriend",
        requestData,{headers:{
          Authorization:`Bearer ${localStorage.getItem("authToken")}`
        }}
      );
      setInvitePending(false)
      console.log(response.data);
    } catch (error) {
      console.error(error);
      // Handle the error appropriately, e.g., set an error message
      setModalMessage(error.message || String(error));
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    async function fetchData() {
      let foundFriends;
      const [userData, loggedInData] = await Promise.all([
        fetchUserData(username),
        fetchUserData(loggedInUsername),
      ]);
      setAvailablity(userData.profileData.availability);
      setRecord(userData.profileData.record);

      for (let i = 0; i < userData.friendShips.length; i++) {
        const friendship = userData.friendShips[i];
        if (
          friendship.sender == loggedInData.profileData._id ||
          friendship.recipient == loggedInData.profileData._id
        ) {
          setRecipient(friendship.recipient == loggedInData.profileData._id);
          foundFriends = friendship;
          break;
        }
      }
      console.log(foundFriends);
      if (foundFriends) {
        setInvitePending(foundFriends.pendingStatus);
        if (!invitePending) setAlreadyFriends(true);
      }
    }
    setLoading(false);
    fetchData();
    console.log("alreadyFriends", alreadyFriends);
    console.log(invitePending);
  }, [invitePending, alreadyFriends]);

  function Component(
    username,
    loggedInUsername,
    alreadyFriends,
    invitePending
  ) {
    let component = null; // Initialize with null

    if (username !== loggedInUsername) {
      // Render buttons only if username is not equal to loggedInUsername
      if (!alreadyFriends) {
        component = (
          <button onClick={() => handleAdd(username)}>Add Friend</button>
        );
      } else {
        if (invitePending) {
          if (recipientUser) {
            component = (
              <>
              <button onClick={() => acceptFriendship(username)}>Accept</button>
              <button onClick={()=>declineFriendship(username)}>Decline</button>
              </>

            );
          } else {
            component = (
              <button
                onClick={() => {
                  setModalMessage("Invite is Pending");
                  setIsModalOpen(true);
                }}
              >
                Pending Invite
              </button>
            );
          }
        } else {
          component = (
            <div>
              <button onClick={()=>navigate(`/chats?userId=${username}`)}>Send Message</button>
              <button onClick={() => handleDelete(username)}>
                Delete Friend
              </button>
            </div>
          );
        }
      }
    }

    return component;
  }

  //set username basedo n the clicked link ?
  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h2>{username}</h2>
          <div className="avatar">
            <img src="https://s3-us-west-2.amazonaws.com/harriscarney/images/150x150.png" />
          </div>
          <div>
            <h2>Record : </h2>
            <p>
              Wins: {record.Wins}, Losses: {record.Losses}
            </p>
            <h2>Availabality : </h2>
            <p>{availabality.toString()}</p>
            {/* needs to be wrapped in an arrow function so that it is only invoked whne cliccked , otherwise it will be invoked handleAdd(username) immediately when rendering the component */}
            <div>
              {Component(
                username,
                loggedInUsername,
                alreadyFriends,
                invitePending
              )}
            </div>
          </div>
        </div>
      )}
      <Modal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
    </>
  );
}

export default PlayerProfile;
