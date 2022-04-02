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
  betState: number;
  getBetState: () => void;
  startNewBet: () => void;
  enterBet: (val: AtLeastTwoNumbers) => void;
  selectedTeam: number;
  winningTeam: number;
  getWinningTeam: () => void;
  win: boolean; // player win or loose
  claim: () => void;
};

const BettingContext = createContext<Context | null>(null);

export const BettingContextProvider = ({ children }: Props) => {
  const [contract, setContract] = useState<Contract>();
  const [betState, setBetState] = useState(0);
  const [winningTeam, setWinningTeam] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState(0);
  const [win, setWin] = useState(false);

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

    setSelectedTeam(val.selectedTeam);

    console.log(receipt);
  };

  const getWinningTeam = async () => {
    if (!account) return;
    if (!contract) return;

    let team = 0;
    const betId = ethers.BigNumber.from(await contract.betId()).toNumber();
    let i: number = betId;
    while (i > 0) {
      team = await contract.betIdWinningTeam(ethers.BigNumber.from(i));
      team = ethers.BigNumber.from(team).toNumber();
      if (i === betId) {
        setWinningTeam(team);
      }
      console.log(`For bet id ${i} the winning team is Team ${team}`);
      i--;
    }

    const player = await contract.players(account);
    const playerSelectedTeam = ethers.BigNumber.from(player[1]).toNumber();
    const playerBetId = ethers.BigNumber.from(player[2]).toNumber();
    console.log(`playr bet id ${playerBetId}`);
    console.log(`playr selected team ${playerSelectedTeam}`);

    setSelectedTeam(playerSelectedTeam);

    if (playerSelectedTeam === team) {
      setWin(true);
    } else {
      setWin(false);
    }
  };

  const claim = async () => {
    if (!account) return;
    if (!contract) return;
  };

  return (
    <BettingContext.Provider
      value={{
        betState,
        getBetState,
        startNewBet,
        enterBet,
        selectedTeam,
        winningTeam,
        getWinningTeam,
        win,
        claim,
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
