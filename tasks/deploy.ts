import { task } from 'hardhat/config';

task('deploy-chainlink-keeper', 'Deploy smart contract')
    .addParam('update', 'Update interval in seconds')
    .setAction(async (taskArgs, hre) => {
        console.log('deploying smart contract...');

        const { ethers, network } = hre;

        const updateInterval = taskArgs.update;

        const ContractFactory = await ethers.getContractFactory('Counter');
        const contract = await ContractFactory.deploy(updateInterval);

        console.log({
            contract: contract.address,
            updateInterval: updateInterval,
        });
    });

export default {};
