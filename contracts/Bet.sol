// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

// KeeperCompatible.sol imports the functions from both ./KeeperBase.sol and
// ./interfaces/KeeperCompatibleInterface.sol
import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import {RandomTeamSelectorInterface} from "./interfaces/RandomTeamSelectorInterface.sol";
import {GovernanceInterface} from "./interfaces/GovernanceInterface.sol";

contract Bet is KeeperCompatibleInterface {
    event GainsClaimed(address indexed claimant, uint256 value);
    event BetStaked(address indexed player, uint256 value, uint256 team);
    event WinnerAnnounced(uint256 team, uint256 betId);

    using Counters for Counters.Counter;
    Counters.Counter private betIdCounter;
    uint256 public betId;

    enum BET_STATE {
        OPEN,
        CLOSED,
        PICKING_TEAM,
        CLAIM
    }
    BET_STATE public betState;

    mapping(uint256 => uint256) public requestIdBetId;
    mapping(uint256 => uint256) public betIdWinningTeam;

    struct Player {
        uint256 amountBet;
        uint256 teamSelected;
        uint256 betId;
    }
    mapping(address => Player) public players;

    // minimum bet is .00015 ETH
    uint256 public MINIMUM_BET = 0.00015 * 10**18;

    uint256 public totalBetTeamOne;
    uint256 public totalBetTeamTwo;

    uint256 public immutable interval;
    uint256 public lastTimeStamp;
    uint256 public expiredTimeStamp;
    uint256 public claimExpiredTimeStamp;

    GovernanceInterface public govInterface;

    constructor(uint256 upkeepInterval, address govInterfaceAddress) {
        interval = upkeepInterval;
        govInterface = GovernanceInterface(govInterfaceAddress);

        betState = BET_STATE.CLOSED;
        lastTimeStamp = block.timestamp;
        expiredTimeStamp = block.timestamp;
        claimExpiredTimeStamp = block.timestamp;

        betId = betIdCounter.current();
        betIdCounter.increment();
    }

    /// Initialise a new bet session
    /// @param duration in seconds for a new betting and claiming sessions
    function startNewBet(uint256 duration) public {
        require(betState == BET_STATE.CLOSED, "Incorrect bet state");
        betState = BET_STATE.OPEN;
        expiredTimeStamp = block.timestamp + duration;

        betId = betIdCounter.current();
        betIdCounter.increment();
    }

    /// Wage a bet by selecting team 1 or team 2
    /// @param team 1 or 2
    function bet(uint256 team) public payable {
        require(team == 1 || team == 2, "Invalid team");
        require(!hasPlayerPlacedBet(msg.sender), "Player already bet");
        require(msg.value >= MINIMUM_BET, "Insufficient bet amount");
        require(betState == BET_STATE.OPEN, "Incorrect bet state");

        if (team == 1) {
            totalBetTeamOne += msg.value;
        } else {
            totalBetTeamTwo += msg.value;
        }
        players[msg.sender].amountBet = msg.value;
        players[msg.sender].teamSelected = team;
        players[msg.sender].betId = betId;

        emit BetStaked(msg.sender, msg.value, team);
    }

    function claim() public {
        require(hasPlayerPlacedBet(msg.sender), "Player has not bet");
        require(betState == BET_STATE.CLAIM, "Incorrect bet state");

        uint256 winner = betIdWinningTeam[betId];

        require(players[msg.sender].teamSelected == winner, "Bet wrong team");

        uint256 senderBet = players[msg.sender].amountBet;
        uint256 totalWinners = totalBetTeamOne;
        uint256 totalLosers = totalBetTeamTwo;

        if (winner == 2) {
            totalWinners = totalBetTeamTwo;
            totalLosers = totalBetTeamOne;
        }

        uint256 total = senderBet + ((senderBet / totalWinners) * totalLosers);

        (bool success, ) = msg.sender.call{value: total}("");

        require(success, "Transfer failed");

        // clean up
        delete players[msg.sender];

        emit GainsClaimed(msg.sender, total);
    }

    function hasPlayerPlacedBet(address playerAddress)
        public
        view
        returns (bool)
    {
        return players[playerAddress].betId == betId;
    }

    function pickWinningTeam() private {
        require(betState == BET_STATE.PICKING_TEAM, "Incorrect bet state");

        uint256 requestId = RandomTeamSelectorInterface(
            govInterface.randomTeamSelector()
        ).requestWinningTeam();

        requestIdBetId[requestId] = betId;
    }

    function setWinningTeam(uint256 requestId, uint256 winningTeam) external {
        require(betState == BET_STATE.PICKING_TEAM, "Incorrect bet state");

        uint256 bId = requestIdBetId[requestId]; // get bet id
        betIdWinningTeam[bId] = winningTeam;

        betState = BET_STATE.CLAIM;

        // claimng session's duration is twice longer than betting session
        claimExpiredTimeStamp = block.timestamp + interval + interval;

        emit WinnerAnnounced(winningTeam, bId);
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
        if (lastTimeStamp > expiredTimeStamp && betState == BET_STATE.OPEN) {
            betState = BET_STATE.PICKING_TEAM;
            pickWinningTeam();
        }
        if (
            lastTimeStamp > claimExpiredTimeStamp && betState == BET_STATE.CLAIM
        ) {
            betState = BET_STATE.CLOSED;
            // clean up
            totalBetTeamOne = 0;
            totalBetTeamTwo = 0;
        }
    }
}
