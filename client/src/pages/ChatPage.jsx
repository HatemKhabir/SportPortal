import io from "socket.io-client";
import { useEffect, useState,useContext } from "react";
import UserContext from "../contexts/UserContext"
import axios from "axios";

var socket,connectedChat

function ChatPage() {
  
  const [ loggedInUsername, setLoggedInUsername,loggedInUserID,setLoggedInUserID ] = useContext(UserContext)
  const [chats,setChats]=useState([])
  
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/chats", {
          params: {
            loggedInUser: loggedInUserID,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });
  setChats(response.data)
      } catch (e) {
        console.log(e);
      }
    };
    fetchChats();
    socket = io.connect("ws://localhost:8080");
  }, [socket]);


//i need to add chat boxed like rectangles that shows the user 
  return (
    <div className="App">
      
    </div>
  );
}

export default ChatPage;