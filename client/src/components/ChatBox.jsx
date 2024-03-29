/* eslint-disable react/prop-types */
import { TextField, Button } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import ScrollableFeed from "react-scrollable-feed";
import UserContext from "../contexts/UserContext";
import axios from "axios";
import io from "socket.io-client";
import SocketContext from "../contexts/SocketContext";

function ChatBox({ selectedChat, messages, setMessages }) {
  const [
    loggedInUsername,
    setLoggedInUsername,
    loggedInUserID,
    setLoggedInUserID,
    userChats,
    setChats,
  ] = useContext(UserContext);
  const socket = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const handleTyping = (e) => {
    setMessage(e.target.value);
  };
  const sendMessage = async () => {
    const messageData = {
      chatId: selectedChat._id,
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
        console.log("the data", data);
        socket.emit("new_message", { data, selectedChat });
        setMessages((prevMessages) => [...prevMessages, data])
      } catch (e) {
        console.log(e);
      }
    }
    setMessage("");
  };

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => socket.off("message recieved");
  }, [socket, setMessages,messages]);

 return (
  <div className="flex flex-col h-full">
    <div className="flex-grow border-4 relative">
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
                      : selectedChat
                      ? selectedChat.users.find(
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
