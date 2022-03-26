import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { constants } from 'ethers';
import { exit } from 'process';
import { Bet, Governance, RandomTeamSelector } from '../typechain';

describe('Bet', function () {
    let bet: Bet;
    let rts: RandomTeamSelector;
    let owner: SignerWithAddress;

    const UPKEEP_INTERVAL_SECS = ethers.BigNumber.from(
        process.env.UPKEEP_INTERVAL_SECS,
    );
    const MOCK_SUBSCRIPTION_ID = 0;
    const MOCK_LINK = constants.AddressZero;

    const deployGovernance = async (): Promise<Governance> => {
        const ContractFactory = await ethers.getContractFactory('Governance');
        return await ContractFactory.deploy();
    };

    const deployRandomTeamSelector = async (
        governanceAddr: string,
        vrfCoordinatorContract:
            | 'MockVRFCoordinator'
            | 'MockVRFCoordinatorUnfulfillable' = 'MockVRFCoordinator',
    ): Promise<RandomTeamSelector> => {
        const contractFactory = await ethers.getContractFactory(
            'RandomTeamSelector',
        );

        const vrfCoordFactory = await ethers.getContractFactory(
            vrfCoordinatorContract,
        );
        const mockVrfCoordinator = await vrfCoordFactory
            .connect(owner)
            .deploy();

        return await contractFactory
            .connect(owner)
            .deploy(
                mockVrfCoordinator.address,
                MOCK_LINK,
                MOCK_SUBSCRIPTION_ID,
                governanceAddr,
            );
    };

    const deployBet = async (govInterfaceAddress: string): Promise<Bet> => {
        const ContractFactory = await ethers.getContractFactory('Bet');

        return await ContractFactory.deploy(
            UPKEEP_INTERVAL_SECS,
            govInterfaceAddress,
        );
    };

    before(async () => {
        const chainlinkUpkeepAddr = `${process.env.CHAINLINK_UPKEEP_ADDRESS}`;
        if (!chainlinkUpkeepAddr) {
            console.log(`Chainlink Upkeep address not available!`);
            exit();
        }
    });

    it("Should return the new greeting once it's changed", async function () {
        console.log('zzz');
    });
});
