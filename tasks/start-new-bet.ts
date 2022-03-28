import { task } from 'hardhat/config';

task('start', 'Initialise new bet session')
    .addParam('duration', 'Duration in seconds of this bet session')
    .setAction(async (taskArgs, hre) => {
        enum BET_STATE {
            OPEN,
            CLOSED,
            PICKING_TEAM,
            CLAIM,
        }

        const { ethers } = hre;
        const contract = `${process.env.BET_CONTRACT_ADDR}`;
        const duration = taskArgs.duration;

        const bet = (await ethers.getContractFactory('Bet')).attach(contract);
        const tx = await bet.startNewBet(duration);
        const receipt = await tx.wait();
        console.log(receipt);

        console.log(BET_STATE[await bet.betState()]);
    });

export default {};
