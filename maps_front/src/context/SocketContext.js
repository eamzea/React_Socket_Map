import React, { createContext } from 'react';
import useSocket from '../hooks/useSocket';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const { socket, isOnline } = useSocket('http://localhost:4000');

  return (
    <SocketContext.Provider value={{ socket, isOnline }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
