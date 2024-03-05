import React, { createContext, useContext } from 'react'
import { io } from 'socket.io-client';

const SocketContext=createContext()

export const SocketProvider = ({ children }) => {
    const socket = io("http://localhost:8080"); 
    console.log("Socket instance created:", socket);
    return (
      <SocketContext.Provider value={socket}>
        {children}
      </SocketContext.Provider>
    );
  };

export default SocketContext