import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';

type Props = {
  children: React.ReactNode;
};
type Context = {
  count: number;
  increment: () => void;
};

// Just find-replace "XContext" with whatever context name you like. (ie. DankContext)
const XContext = createContext<Context | null>(null);

export const XContextProvider = ({ children }: Props) => {
  const [count, setCount] = useState(0);

  const { chainId, account, activate, active } = useWeb3React<Web3Provider>();

  useEffect(() => {
    setCount(666);
  }, []);

  const increment = () => {
    setCount(count + 1);
    console.log(account);
  };

  return (
    <XContext.Provider value={{ count, increment }}>
      {children}
    </XContext.Provider>
  );
};

export const useXContext = () => {
  const context = useContext(XContext);

  if (!context)
    throw new Error('XContext must be called from within the XContextProvider');

  return context;
};
