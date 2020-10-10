import React from 'react';

interface UsernameContextProps {
    activeUsername: string;
    setActiveUsername: (value: string)=> void;
}
 
export const UsernameContext = React.createContext({} as UsernameContextProps);