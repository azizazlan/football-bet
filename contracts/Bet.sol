// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// KeeperCompatible.sol imports the functions from both ./KeeperBase.sol and
// ./interfaces/KeeperCompatibleInterface.sol
import '@chainlink/contracts/src/v0.8/KeeperCompatible.sol';
import { MerkleProof } from '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';
import { RandomTeamSelectorInterface } from './interfaces/RandomTeamSelectorInterface.sol';
import { GovernanceInterface } from './interfaces/GovernanceInterface.sol';

contract Bet is KeeperCompatibleInterface {
    event GainsClaimed(address indexed _address, uint256 _value);
    /**
     * Public counter variable
     */
    uint256 public counter;

    enum BET_STATE {
        OPEN,
        CLOSED,
        CALCULATING_WINNER
    }
    BET_STATE public betState;
    mapping(address => uint256) public players;
    uint256 public betId;
    // minimum bet is .01 ETH
    uint256 public MINIMUM_BET = 1000000000000000;

    uint256 public totalBetTeamOne;
    uint256 public totalBetTeamTwo;

    address[] public playersBetTeamOne;
    address[] public playersBetTeamTwo;

    mapping(address => uint256) public claimed;

    uint256 public immutable interval;
    uint256 public lastTimeStamp;
    uint256 public expiredTimeStamp;
    GovernanceInterface public govInterface;

    using MerkleProof for bytes32[];
    bytes32 merkleRoot;
    uint256 public winner;

    constructor(uint256 upkeepInterval, address govInterfaceAddress) {
        interval = upkeepInterval;
        govInterface = GovernanceInterface(govInterfaceAddress);

        betState = BET_STATE.CLOSED;
        lastTimeStamp = block.timestamp;
        expiredTimeStamp = block.timestamp;
    }

    /// Initialise a new bet session
    /// @param duration in seconds for a new session bet
    function initNewBet(uint256 duration) public {
        // require(betState == BET_STATE.CLOSED, 'Cannot init a new bet');
        // betState = BET_STATE.OPEN;
        expiredTimeStamp = block.timestamp + duration;
    }

    /// enter the bet by selecting team 1 or team 2
    /// @param team 1 or 2
    function enter(uint8 team) public payable {
        require(team == 1 || team == 2, 'Invalid team');
        require(!checkPlayer(msg.sender), 'Player already placed a bet');
        require(msg.value >= MINIMUM_BET, 'Bet amount not sufficient');
        require(betState == BET_STATE.OPEN, 'Incorrect bet state');

        if (team == 1) {
            playersBetTeamOne.push(msg.sender);
            totalBetTeamOne += msg.value;
        } else {
            playersBetTeamTwo.push(msg.sender);
            totalBetTeamTwo += msg.value;
        }
        players[msg.sender] = msg.value;
    }

    function claim(bytes32[] memory proof) public {
        require(merkleRoot != 0, 'No winner yet for this bet');
        require(
            proof.verify(merkleRoot, keccak256(abi.encodePacked(msg.sender))),
            'You are not in the list'
        );

        uint256 senderBet = players[msg.sender];
        uint256 totalWinners = totalBetTeamOne;
        uint256 totalLosers = totalBetTeamTwo;

        if (winner == 2) {
            totalWinners = totalBetTeamTwo;
            totalLosers = totalBetTeamOne;
        }

        uint256 total = senderBet + ((senderBet / totalWinners) * totalLosers);

        (bool success, ) = msg.sender.call{ value: total }('');

        require(success, 'Transfer failed.');

        // clean up
        delete players[msg.sender];

        emit GainsClaimed(msg.sender, total);
    }

    function checkPlayer(address playerAddress) public view returns (bool) {
        return !(players[playerAddress] == 0);
    }

    function pickWinningTeam() private {
        // require(betState == BET_STATE.CALCULATING_WINNER, 'Not in the state');
        RandomTeamSelectorInterface(govInterface.randomTeamSelector())
            .requestWinningTeam();
        //this kicks off the VRF request and returns through setWinningTeam
        counter = counter + 1;
        // betState = BET_STATE.CLOSED;
    }

    // Time KeeperCompatible functions

    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
    }

    function performUpkeep(
        bytes calldata /* performData */
    ) external override {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval) {
            lastTimeStamp = block.timestamp;
        }
        if (lastTimeStamp > expiredTimeStamp) {
            // betState = BET_STATE.CALCULATING_WINNER;
            pickWinningTeam();
        }
    }

    // RandomTeamSelector will call setWinningTeam via its VRF fulfillRandomWords

    function setWinningTeam(uint256 winningTeam) external {
        // require(
        //     betState == BET_STATE.CALCULATING_WINNER,
        //     'State condition is not met'
        // );

        winner = winningTeam;

        // uint256 index = randomness % players.length;
        // players[index].transfer(address(this).balance);

        // betState = BET_STATE.CLOSED;

        // You could have this run forever
        // start_new_lottery();
        // or with a cron job from a chainlink node would allow you to
        // keep calling "start_new_lottery" as well
    }
}
