import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { ethers, Contract } from 'ethers';
import Bet from '../artifacts/contracts/Bet.sol/Bet.json';

type Props = {
  children: React.ReactNode;
};
type Context = {
  count: number;
  betState: number;
  getBetState: () => void;
  startNewBet: () => void;
};

const BettingContext = createContext<Context | null>(null);

export const BettingContextProvider = ({ children }: Props) => {
  const [count, setCount] = useState(0);
  const [contract, setContract] = useState<Contract>();
  const [betState, setBetState] = useState(0);

  const { ethereum } = window;
  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();

  useEffect(() => {
    setCount(666);
    const contractAddress = `${process.env.BET_CONTRACT_ADDR}`;
    const provider = new ethers.providers.Web3Provider(ethereum);

    const contract = new ethers.Contract(contractAddress, Bet.abi, provider);
    setContract(contract);
  }, []);

  const getBetState = async () => {
    const s = await contract?.betState();
    setBetState(s);
  };

  const startNewBet = async () => {
    const signer = library?.getSigner();
    if (!signer) return;

    await contract?.connect(signer).startNewBet(60);
  };

  return (
    <BettingContext.Provider
      value={{ count, betState, getBetState, startNewBet }}
    >
      {children}
    </BettingContext.Provider>
  );
};

export const useBettingContext = () => {
  const context = useContext(BettingContext);

  if (!context)
    throw new Error(
      'BettingContext must be called from within the BettingContextProvider',
    );

  return context;
};
