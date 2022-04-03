import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { ethers, Contract } from 'ethers';
import Bet from '../artifacts/contracts/Bet.sol/Bet.json';

const DELAY_INTERVAL = 5000; // 5 seconds

type Props = {
  children: React.ReactNode;
};

type AtLeastTwoNumbers = { selectedTeam: number; betAmountInEther: number };

type Context = {
  delayInterval: number;
  pending: boolean;
  betState: number;
  getBetState: () => void;
  startNewBet: () => void;
  enterBet: (val: AtLeastTwoNumbers) => void;
  selectedTeam: number;
  winningTeam: number;
  getWinningTeam: () => void;
  win: boolean; // player win or loose
  claim: () => void;
  hasPlayerBet: boolean;
};

const BettingContext = createContext<Context | null>(null);

export const BettingContextProvider = ({ children }: Props) => {
  const [pending, setPending] = useState(false);
  const [contract, setContract] = useState<Contract>();
  const [betState, setBetState] = useState(1); // CLOSED
  const [winningTeam, setWinningTeam] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState(0);
  const [win, setWin] = useState(false);
  const [delayInterval, setDelayInterval] = useState(DELAY_INTERVAL);
  const [hasPlayerBet, setHasPlayerBet] = useState(false);

  const { ethereum } = window;
  const { chainId, account, activate, active, library } =
    useWeb3React<Web3Provider>();

  useEffect(() => {
    const contractAddress = `${process.env.BET_CONTRACT_ADDR}`;
    const provider = new ethers.providers.Web3Provider(ethereum);

    const contract = new ethers.Contract(contractAddress, Bet.abi, provider);
    setContract(contract);
  }, []);

  const getBetState = async () => {
    if (!contract) {
      console.log('No contract');
      return;
    }
    const s = await contract.betState();
    setBetState(s);

    const betId = ethers.BigNumber.from(await contract.betId()).toNumber();

    const player = await contract.players(account);
    const playerSelectedTeam = ethers.BigNumber.from(player[1]).toNumber();
    const playerBetId = ethers.BigNumber.from(player[2]).toNumber();

    if (playerBetId === betId) {
      setHasPlayerBet(true);
    } else setHasPlayerBet(false);
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
      getBetState();
    } catch (err) {
      setPending(false);
      setDelayInterval(DELAY_INTERVAL);
    }
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

    setPending(true);
    setDelayInterval(5 * DELAY_INTERVAL);

    try {
      // Convert Ether to wei
      const betAmount = ethers.utils.parseEther(
        val.betAmountInEther.toString(),
      );
      const tx = await contract
        .connect(signer)
        .bet(val.selectedTeam, { value: betAmount });
      const receipt = await tx.wait();

      setSelectedTeam(val.selectedTeam);
      setHasPlayerBet(true);
      console.log(receipt);
      setPending(false);
      setDelayInterval(DELAY_INTERVAL);
    } catch (error) {
      console.log(error);
      setPending(false);
      setDelayInterval(DELAY_INTERVAL);
      getBetState();
    }
  };

  const getWinningTeam = async () => {
    if (!account) return;
    if (!contract) return;

    const player = await contract.players(account);
    const playerSelectedTeam = ethers.BigNumber.from(player[1]).toNumber();
    const playerBetId = ethers.BigNumber.from(player[2]).toNumber();
    setSelectedTeam(playerSelectedTeam);
    console.log(`Player selectedTeam ${playerSelectedTeam}`);

    const betId = ethers.BigNumber.from(await contract.betId()).toNumber();
    const lastWinningTeam = await contract.betIdWinningTeam(betId);
    setWinningTeam(lastWinningTeam.toNumber());
    console.log(`lastWinningTeam ${lastWinningTeam}`);

    if (playerSelectedTeam === winningTeam) {
      setWin(true);
    } else {
      setWin(false);
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
    setDelayInterval(DELAY_INTERVAL);
  };

  return (
    <BettingContext.Provider
      value={{
        delayInterval,
        pending,
        betState,
        getBetState,
        startNewBet,
        enterBet,
        selectedTeam,
        winningTeam,
        getWinningTeam,
        win,
        claim,
        hasPlayerBet,
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
