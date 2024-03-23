import io from "socket.io-client";
import { useEffect, useState, useContext } from "react";
import UserContext from "../contexts/UserContext";
import axios from "axios";
import AllChats from "../components/allChats";
import ChatBox from "../components/ChatBox";
import Box from '@mui/material/Box';
import SocketContext from "../contexts/SocketContext";
import {useNavigate, useParams } from "react-router-dom";


var socket;

function ChatPage() {
  const [loggedInUsername, 
    setLoggedInUsername,
    loggedInUserID,
    setLoggedInUserID,
    selectedChats,
    setChats
    ] = useContext(UserContext);
    const socket=useContext(SocketContext)
    const navigate=useNavigate();
  
  const selectChat = (chat) => {
    setChats(chat);
    navigate(`/chats?id=${chat._id}`);
    socket.emit('join_chatroom', { loggedInUserID, chat });
  };

  useEffect(() => {
    socket.emit('setup', loggedInUserID);
  }, [socket, loggedInUserID]);

  return (
    <>
      <div className="flex justify-between flex-row mx-auto ">
        <div className="basis-1/5 border-cyan-700 border-4">
          <h2 className="text-center font-serif subpixel-antialiased italic text-lg text-sky-600">My Chats</h2>
          <AllChats setSelectedChat={selectChat} />
        </div>
        <Box className="relative basis-full border-4">
          <ChatBox selectedChat={selectedChats} />
        </Box>
      </div>
    </>
  );
}

export default ChatPage;