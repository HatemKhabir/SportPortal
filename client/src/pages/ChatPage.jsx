import io from "socket.io-client";
import { useEffect, useState, useContext } from "react";
import UserContext from "../contexts/UserContext";
import axios from "axios";
import AllChats from "../components/allChats";
import ChatBox from "../components/chatBox";
import Box from '@mui/material/Box';


var socket;

function ChatPage() {
  const [loggedInUsername, 
    setLoggedInUsername,
    loggedInUserID,
    setLoggedInUserID,
    userChats,
    setChats
    ] = useContext(UserContext);
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
    socket.emit("join chat",selectedChat._id)
    }catch(e){
      console.log(e)
    }
  }
  fetchMessages()
  },[selectedChat])
  useEffect(()=>{
    socket=io("http://localhost:8080")
    socket.emit("setup",loggedInUserID)
    socket.on("connect",()=>{console.log("socket connected",socket.id)})
  },[])
   
  useEffect(()=>{
    
    socket.on("message recieved",(newMessageRecieved)=>{
      setMessages([...messages,newMessageRecieved])
    })
  })
  return(<>
  <div className="flex justify-between flex-row mx-auto ">
    <div className="basis-1/5 border-cyan-700 border-4">
      <h2 className="text-center font-serif subpixel-antialiased italic text-lg text-sky-600   ">My Chats</h2>
           <AllChats setSelectedChat={setSelectedChat}/>
    </div>
    <Box className="relative basis-full border-4">
           <ChatBox socket={socket} messages={messages} setMessages={setMessages} selectedChat={selectedChat}/>
    </Box>
  </div>
  
  </>)
}

export default ChatPage;
