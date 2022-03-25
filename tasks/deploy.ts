import { task } from 'hardhat/config';

task('deploy', 'Deploy Bet smart contract').setAction(async (taskArgs, hre) => {
    const { ethers, network } = hre;

    // Governance
    console.log('Deploying Governance contract...');
    const GovernanceContractFactory = await ethers.getContractFactory(
        'Governance',
    );
    const governance = await GovernanceContractFactory.deploy();
    console.log(`Governance deployed at ${governance.address}`);

    // RandomTeamSelector
    const subscriptionId = `${process.env.CHAINLINK_VRF_SID}`;
    console.log(
        `\nDeploying VRFConsumerV2 contract that uses Subscription Id ${subscriptionId} ...`,
    );
    const RandomTeamSelectorFactory = await ethers.getContractFactory(
        'RandomTeamSelector',
    );
    const rts = await RandomTeamSelectorFactory.deploy(
        subscriptionId,
        governance.address,
    );
    console.log(`RandomTeamSelector is deployed at ${rts.address}`);
    console.log(
        'Note: To add the consumer address at https://vrf.chain.link/new',
    );

    // Bet
    const upkeepInterval = `${process.env.UPKEEP_INTERVAL_SECS}`;
    console.log(
        `\nDeploying Bet contract with upkeep interval of ${upkeepInterval} seconds ...`,
    );
    const BetContractFactory = await ethers.getContractFactory('Bet');
    const bet = await BetContractFactory.deploy(
        upkeepInterval,
        governance.address,
    );
    console.log(`Bet is deployed at ${bet.address}`);
    console.log(
        `Register this new Upkeep contract at https://keepers.chain.link/chapel`,
    );
});

export default {};
