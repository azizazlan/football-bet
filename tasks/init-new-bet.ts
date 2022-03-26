import { task } from 'hardhat/config';

task('initbet', 'Initialise new bet')
    .addParam('betcontract', 'Address of Bet contract')
    .addParam('duration', 'Duration in seconds of this bet session')
    .setAction(async (taskArgs, hre) => {
        const { ethers, network } = hre;
        const contract = taskArgs.betcontract;
        const duration = taskArgs.duration;

        const bet = (await ethers.getContractFactory('Bet')).attach(contract);
        const tx = await bet.initNewBet(duration);
        const receipt = await tx.wait();
        console.log(receipt);
    });

export default {};
