import { ethers } from 'ethers';
import Bet from '../../artifacts/contracts/Bet.sol/Bet.json';

declare var window: any;

export async function fetchBetState() {
  const { ethereum } = window;
  if (!ethereum) {
    alert('Please install MetaMask!');
    return;
  }
  const contractAddr = `${process.env.BET_CONTRACT_ADDR}`;
  const provider = new ethers.providers.Web3Provider(ethereum);
  const bet = new ethers.Contract(contractAddr, Bet.abi, provider);
  const betState = await bet.betState();
  return betState;
}
