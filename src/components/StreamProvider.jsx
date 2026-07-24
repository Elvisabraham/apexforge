import React, { createContext, useState, useContext } from 'react';

// 1. Create the Global Context
const StreamContext = createContext();

// 2. Create a Custom Hook for easy access across any component
export const useStream = () => useContext(StreamContext);

// 3. Create the Provider Component
export const StreamProvider = ({ children }) => {
  const [activeStreamUrl, setActiveStreamUrl] = useState(null);

  const startStream = (url) => {
    setActiveStreamUrl(url);
  };

  const stopStream = () => {
    setActiveStreamUrl(null);
  };

  return (
    <StreamContext.Provider value={{ activeStreamUrl, startStream, stopStream }}>
      {children}
    </StreamContext.Provider>
  );
};