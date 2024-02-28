import io from "socket.io-client";
import { useEffect, useState, useContext } from "react";
import UserContext from "../contexts/UserContext";
import axios from "axios";

var socket, connectedChat;

function ChatPage() {
  const [
    loggedInUsername,
    setLoggedInUsername,
    loggedInUserID,
    setLoggedInUserID,
  ] = useContext(UserContext);
  const [chats, setChats] = useState([]);

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
        setChats(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    console.log(chats);
  }, [chats]);
  //i need to add chat boxed like rectangles that shows the user
  return (
    <>
      {chats && (
        <ul
          role="list"
          className="mt-5 pl-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
        >
          {chats.map((chat) => (
            
            <li key={chat._id} onClick={()=>{alert("chat clicked")}} className="btn hover:cursor-pointer shadow-[0_9px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] ease-out w-2/3 hover:translate-y-1 transition-all col-span-1 divide-y divide-gray-200 rounded-lg bg-white">
              <div className="flex  w-full items-center justify-between space-x-6 p-4">
                <div className="flex-1 truncate">
                  <div className="flex flex-col items-center space-x-3 ">
                    <h3 className="text-sm font-medium text-gray-900">
                         {chat.isGroupChat?chat.eventId.eventTitle:chat.latestMsg?chat.latestMsg.senderID.username:chat.users[1].username}
                    </h3>
                    <p className=" truncate text-sm text-gray-500">
                    {
  chat.latestMsg && chat.latestMsg.content
    ? `${
        chat.latestMsg.senderID === loggedInUserID ? "You" : chat.latestMsg.senderID.username
      }: ${chat.latestMsg.content}`
    : "No Recent Messages"
}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default ChatPage;
