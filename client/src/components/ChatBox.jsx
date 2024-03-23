/* eslint-disable react/prop-types */
import { TextField, Button } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import ScrollableFeed from "react-scrollable-feed";
import UserContext from "../contexts/UserContext";
import axios from "axios";
import io from "socket.io-client";
import SocketContext from "../contexts/SocketContext";
import { useLocation } from "react-router-dom";

function ChatBox({ selectedChat }) {
  const [loggedInUsername, 
    setLoggedInUsername,
    loggedInUserID,
    setLoggedInUserID,
    selectedChats,
    setChats
    ] = useContext(UserContext);
  const location = useLocation();
  const urlQuery = new URLSearchParams(location.search);
  const chatId = urlQuery.get("id");
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleTyping = (e) => {
    setMessage(e.target.value);
  };
  const sendMessage = async () => {
    const messageData = {
      chatId: chatId,
      messageContent: message,
      senderID: loggedInUserID,
    };
    console.log(messageData);
    if (message) {
      try {
        const data = await axios.post(
          "http://localhost:8080/api/message",
          {
            messageData,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        console.log("the data", data.data);
        socket.emit("new_message", { data, selectedChats });
        setMessages((prevMessages) => [...prevMessages, data.data]);
        console.log("post message update",messages);
      } catch (e) {
        console.log(e);
      }
    }
    setMessage("");
  };

  useEffect(() => {
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/message", {
          params: {
            chatId: chatId,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        console.log(response);
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedChats) {
      fetchMessages();
    }
    socket.on("message recieved", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      console.log("post socket recieve messages",messages);
    });
    return () => socket.off("message recieved");
  }, [socket, chatId, selectedChats]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow border-4 relative">
        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <ScrollableFeed>
            {messages &&
              messages.map((m) => {
                return (
                  <div key={m._id} style={{ display: "flex" }}>
                    <span
                      style={{
                        backgroundColor: `${
                          m.senderID === loggedInUserID ? "#BEE3F8" : "#B9F5D0"
                        }`,
                        marginLeft: `${
                          m.senderID === loggedInUserID ? "auto" : "0"
                        }`,
                        borderRadius: "20px",
                        padding: "5px 15px",
                        maxWidth: "75%",
                      }}
                    >
                      <h3 className="text-xs underline font-bold">
                        {m.senderID === loggedInUserID
                          ? loggedInUsername // Display logged-in user's username
                          : selectedChats && selectedChats.users
                          ? selectedChats.users.find(
                              (user) => user._id === m.senderID
                            )?.username
                          : ""}
                      </h3>
                      <p>{m.content}</p>
                    </span>
                  </div>
                );
              })}
          </ScrollableFeed>
        )}
      </div>
      <div className="flex items-center justify-between">
        <TextField
          autoFocus
          onChange={handleTyping}
          className="mt-auto w-11/12"
          id="standard-textarea"
          label="Chat"
          placeholder="Write Your Message"
          multiline
          value={message}
          variant="standard"
        />
        <Button onClick={sendMessage} className="w-1/12 flex-shrink-0">
          Send
        </Button>
      </div>
    </div>
  );
}
export default ChatBox;
