import io from "socket.io-client";
import { useEffect, useState, useContext } from "react";
import UserContext from "../contexts/UserContext";
import axios from "axios";
import AllChats from "../components/allChats";
import ChatBox from "../components/ChatBox";
import Box from '@mui/material/Box';
import SocketContext from "../contexts/SocketContext";
import {useNavigate } from "react-router-dom";


var socket;

function ChatPage() {
  const [loggedInUsername, 
    setLoggedInUsername,
    loggedInUserID,
    setLoggedInUserID,
    userChats,
    setChats
    ] = useContext(UserContext);
    const socket=useContext(SocketContext)
    const navigate=useNavigate();
  const [messages,setMessages]=useState([])
  const [selectedChat,setSelectedChat]=useState([])
  
 
  useEffect(()=>{
   const fetchMessages=async ()=>{
    try{
      const response = await axios.get("http://localhost:8080/api/message", {
        params: {
          chatId: selectedChat._id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${localStorage.getItem("authToken")}`
        },
      });
     
    setMessages(response.data)
    }catch(e){
      console.log(e)
    }
  }
  fetchMessages()
  console.log('meesages',messages)
  socket.emit('setup',loggedInUserID)
  },[selectedChat,socket,loggedInUserID])

const selectChat=(chat)=>{
  setSelectedChat(chat)
  navigate(`/chat?id=${chat._id}`)
  socket.emit('join_chatroom',{loggedInUserID,chat})
}
  return(<>
  <div className="flex justify-between flex-row mx-auto ">
    <div className="basis-1/5 border-cyan-700 border-4">
      <h2 className="text-center font-serif subpixel-antialiased italic text-lg text-sky-600   ">My Chats</h2>
           <AllChats setSelectedChat={selectChat}/>
    </div>
    <Box className="relative basis-full border-4">
           <ChatBox selectedChat={selectedChat}/>
    </Box>
  </div>
  
  </>)
}

export default ChatPage;
