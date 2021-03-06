// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import '@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol';
import '@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol';
import '@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol';
import { BetInterface } from './interfaces/BetInterface.sol';
import { GovernanceInterface } from './interfaces/GovernanceInterface.sol';

contract RandomTeamSelector is VRFConsumerBaseV2 {
    // Your subscription ID.
    uint64 s_subscriptionId;

    // Rinkeby coordinator. For other networks,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    // address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
    // BNB Testnet
    // address vrfCoordinator = 0x6A2AAd07396B36Fe02a22b33cf443582f682c82f;

    // Rinkeby LINK token contract. For other networks,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    // address link = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
    // BNB Testnet
    // address link = 0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06;

    VRFCoordinatorV2Interface internal COORDINATOR;
    LinkTokenInterface internal LINKTOKEN;

    // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf-contracts/#configurations
    // bytes32 keyHash =
    //     0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    // BNB Testnet
    bytes32 keyHash =
        0xd4bb89654db74673a187bd804519e65e3f71a52bc55f11da7601a13dcf505314;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 300000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords = 1;

    uint256[] public s_randomWords;

    uint256 public s_requestId;
    address s_owner;

    GovernanceInterface public govInterface;

    constructor(
        address vrfCoordinator,
        address link,
        uint64 subscriptionId,
        address govInterfaceAddr
    ) VRFConsumerBaseV2(vrfCoordinator) {
        COORDINATOR = VRFCoordinatorV2Interface(vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(link);
        s_owner = msg.sender;
        s_subscriptionId = subscriptionId;
        govInterface = GovernanceInterface(govInterfaceAddr);
    }

    function requestWinningTeam() external returns (uint256) {
        requestRandomWords();
        return s_requestId;
    }

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords() internal {
        // Will revert if subscription is not set and funded.
        s_requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        s_requestId = requestId;
        s_randomWords = randomWords;
        uint256 winningTeam = (randomWords[0] % 2) + 1;
        BetInterface(govInterface.bet()).setWinningTeam(requestId, winningTeam);
    }

    modifier onlyOwner() {
        require(msg.sender == s_owner, 'Not the owner');
        _;
    }
}
