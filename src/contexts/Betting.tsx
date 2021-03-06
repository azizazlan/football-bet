import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { ethers, Contract } from 'ethers';
import Bet from '../artifacts/contracts/Bet.sol/Bet.json';

const DELAY_INTERVAL = 5000; // 5 seconds

type Props = {
  children: React.ReactNode;
};

type Player = {
  amountBet: number;
  teamSelected: number;
  betId: number;
  hasClaimed: boolean;
  amountClaimed: string;
};

export enum BetState {
  OPEN = 0,
  CLOSED = 1,
  RANDOM = 2,
  CLAIM = 3,
}

type BetSession = {
  betId: number;
  betState: BetState;
  winningTeam: number;
};

type BetInputType = { selectedTeam: number; betAmountInEther: number };

type Context = {
  delayInterval: number;
  pending: boolean;
  betSession: BetSession;
  updateBetSession: () => void;
  startNewBet: () => void;
  enterBet: (val: BetInputType) => void;
  updateWinningTeam: () => void;
  claim: () => void;
  player: Player;
};

const BettingContext = createContext<Context | null>(null);

export const BettingContextProvider = ({ children }: Props) => {
  const [pending, setPending] = useState(false);
  const [contract, setContract] = useState<Contract>();
  const [betSession, setBetSession] = useState<BetSession>({
    betId: -1,
    betState: BetState.CLOSED,
    winningTeam: -1,
  });
  const [delayInterval, setDelayInterval] = useState(DELAY_INTERVAL);
  const [player, setPlayer] = useState<Player>({
    amountBet: 0,
    teamSelected: -1,
    betId: -1,
    hasClaimed: false,
    amountClaimed: '0',
  });

  const { account, library } = useWeb3React<Web3Provider>();

  useEffect(() => {
    const contractAddress = `${process.env.BET_CONTRACT_ADDR}`;
    const contract = new ethers.Contract(contractAddress, Bet.abi, library);
    setContract(contract);
  }, [library]);

  const updateBetSession = async () => {
    if (!contract) {
      console.log('No contract');
      return;
    }
    const betId = ethers.BigNumber.from(await contract.betId()).toNumber();
    const betState = ethers.BigNumber.from(
      await contract.betState(),
    ).toNumber();
    setBetSession({ ...betSession, betId: betId, betState: betState });
  };

  const startNewBet = async () => {
    const signer = library?.getSigner();
    if (!signer) return;

    if (!contract) {
      console.log('No contract instance');
      return;
    }

    setDelayInterval(3 * DELAY_INTERVAL);
    setPending(true);

    try {
      const tx = await contract.connect(signer).startNewBet(60);
      const receipt = await tx.wait();
      console.log(receipt);

      setPending(false);
      setDelayInterval(DELAY_INTERVAL);

      const betId = ethers.BigNumber.from(await contract.betId()).toNumber();
      const betState = await contract.betState();
      setBetSession({ betId: betId, betState: betState, winningTeam: -1 });
    } catch (err) {
      setPending(false);
      setDelayInterval(DELAY_INTERVAL);
    }
  };

  const enterBet = async (val: BetInputType) => {
    const signer = library?.getSigner();
    if (!signer) {
      console.log('No signer');
      return;
    }
    if (!contract) {
      console.log('No contract');
      return;
    }

    setPending(true);
    setDelayInterval(5 * DELAY_INTERVAL);

    try {
      const betId = ethers.BigNumber.from(await contract.betId()).toNumber();

      // Convert Ether to wei
      const betAmount = ethers.utils.parseEther(
        val.betAmountInEther.toString(),
      );
      const tx = await contract
        .connect(signer)
        .bet(val.selectedTeam, { value: betAmount });
      const receipt = await tx.wait();

      setPlayer({
        amountBet: val.betAmountInEther,
        teamSelected: val.selectedTeam,
        betId: betId,
        hasClaimed: false,
        amountClaimed: '0',
      });

      console.log(receipt);
      setPending(false);
      setDelayInterval(DELAY_INTERVAL);
    } catch (error) {
      console.log(error);
      setPending(false);
      setDelayInterval(DELAY_INTERVAL);
    }
  };

  const updateWinningTeam = async () => {
    if (!account) return;
    if (!contract) return;

    const betId = ethers.BigNumber.from(await contract.betId()).toNumber();
    const winningTeam = ethers.BigNumber.from(
      await contract.betIdWinningTeam(betId),
    ).toNumber();
    if (betSession.betId === betId) {
      setBetSession({ ...betSession, winningTeam: winningTeam });
    } else {
      console.log(`updateWinningTeam betId does not match!`);
    }
  };

  const claim = async () => {
    const signer = library?.getSigner();
    if (!signer) {
      console.log('No signer');
      return;
    }
    if (!contract) return;

    setDelayInterval(5 * DELAY_INTERVAL);
    const tx = await contract.connect(signer).claim();
    const receipt = await tx.wait();
    console.log(receipt);

    if (receipt.events[0].event === 'GainsClaimed') {
      let amount = receipt.events[0].args[1]; // big number
      amount = ethers.BigNumber.from(amount);
      const amountInEther = ethers.utils.formatEther(amount);
      setPlayer({ ...player, hasClaimed: true, amountClaimed: amountInEther });
    }
    setDelayInterval(DELAY_INTERVAL);
  };

  return (
    <BettingContext.Provider
      value={{
        delayInterval,
        pending,
        betSession,
        updateBetSession,
        startNewBet,
        enterBet,
        updateWinningTeam,
        claim,
        player,
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
