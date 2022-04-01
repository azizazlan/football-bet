import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { ethers, Contract } from 'ethers';
import Bet from '../artifacts/contracts/Bet.sol/Bet.json';

type Props = {
  children: React.ReactNode;
};

type AtLeastTwoNumbers = { selectedTeam: number; betAmountInEther: number };

type Context = {
  count: number;
  betState: number;
  getBetState: () => void;
  startNewBet: () => void;
  enterBet: (val: AtLeastTwoNumbers) => void;
  winningTeam: number;
  getWinningTeam: () => void;
};

const BettingContext = createContext<Context | null>(null);

export const BettingContextProvider = ({ children }: Props) => {
  const [count, setCount] = useState(0);
  const [contract, setContract] = useState<Contract>();
  const [betState, setBetState] = useState(0);
  const [winningTeam, setWinningTeam] = useState(0);

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

    if (!contract) {
      console.log('No contract instance');
      return;
    }

    const tx = await contract.connect(signer).startNewBet(60);
    const receipt = await tx.wait();
    console.log(receipt);
  };

  const enterBet = async (val: AtLeastTwoNumbers) => {
    const signer = library?.getSigner();
    if (!signer) {
      console.log('No signer');
      return;
    }
    if (!contract) {
      console.log('No contract');
      return;
    }

    // Convert Ether to wei
    const betAmount = ethers.utils.parseEther(val.betAmountInEther.toString());

    const tx = await contract
      .connect(signer)
      .bet(val.selectedTeam, { value: betAmount });
    const receipt = await tx.wait();
    console.log(receipt);
  };

  const getWinningTeam = async () => {
    if (!contract) return;

    let i: number = ethers.BigNumber.from(await contract.betId()).toNumber();
    while (i > 0) {
      const team = await contract.betIdWinningTeam(ethers.BigNumber.from(i));
      console.log(
        `For bet id ${i} the winning team is Team ${ethers.BigNumber.from(
          team,
        ).toNumber()}`,
      );
      i--;
    }
  };

  return (
    <BettingContext.Provider
      value={{
        count,
        betState,
        getBetState,
        startNewBet,
        enterBet,
        winningTeam,
        getWinningTeam,
      }}
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
