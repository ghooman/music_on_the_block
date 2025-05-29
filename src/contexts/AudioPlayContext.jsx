import { createContext, useState } from 'react';

export const AudioPlayContext = createContext(null);

export const AudioPlayProvider = ({ children }) => {
  const [playData, setPlayData] = useState(null);

  return (
    <AudioPlayContext.Provider value={{ playData, setPlayData }}>
      {children}
    </AudioPlayContext.Provider>
  );
};
