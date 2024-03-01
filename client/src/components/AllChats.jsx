import React from 'react'
import io from "socket.io-client";
import { useEffect, useState, useContext } from "react";
import UserContext from "../contexts/UserContext";
import axios from "axios";


function AllChats() {
    const [loggedInUsername, 
      setLoggedInUsername,
      loggedInUserID,
      setLoggedInUserID,
      userChats,
      setChats
      ] = useContext(UserContext);
useEffect(() => {
  console.log(loggedInUsername)
  console.log(loggedInUserID)
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
        console.log(userChats)
      }, []);
      useEffect(() => {
        console.log(userChats);
      }, [userChats]);
  return (
    <>
        {userChats && (
      <ul
        role="list"
        className="mt-1 pl-5 w-full grid gap-2 sm:ml-1 sm:grid-cols-1 lg:grid-cols-1"
      >
        {userChats.map((chat) => (
          
          <li key={chat._id} onClick={()=>{alert("chat clicked")}} className=" mb-2.5 sm:-ml-1 lg:ml-4 btn hover:cursor-pointer shadow-[0_4px_0_rgb(0,0,0)] hover:shadow-[0_4px_0px_rgb(0,0,0)] w-4/5 hover:translate-y-1 transition-all col-span-1 divide-y divide-gray-200 rounded-lg bg-white">
            <div className="flex  w-full items-center justify-between space-x-6 p-4">
              <div className="flex-1 truncate">
                <div className="flex flex-col items-center space-x-2 ">
                  <h3 className="text-sm font-medium text-gray-900">
                       {chat.isGroupChat?chat.eventId.eventTitle:chat.users[0].username==loggedInUsername?chat.users[1].username:chat.users[0].username}
                  </h3>
                  <p className=" truncate text-sm text-gray-500">
                  {
chat.latestMsg && chat.latestMsg.content
  ? `${
      chat.latestMsg.senderID._id === loggedInUserID ? "You" : chat.latestMsg.senderID.username
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
  )
}

export default AllChats