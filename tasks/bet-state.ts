import { task } from 'hardhat/config';

task('state', 'Get the bet state').setAction(async (taskArgs, hre) => {
  enum BET_STATE {
    OPEN,
    CLOSED,
    PICKING_TEAM,
    CLAIM,
  }

  const { ethers } = hre;
  const contract = `${process.env.BET_CONTRACT_ADDR}`;

  const bet = (await ethers.getContractFactory('Bet')).attach(contract);

  console.log(BET_STATE[await bet.betState()]);
});

export default {};
