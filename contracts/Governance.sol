// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Governance {
    uint256 public oneTime;
    address public bet;
    address public randomTeamSelector;

    constructor() {
        oneTime = 1;
    }

    function init(address betAddress, address randomTeamSelectorAddress)
        public
    {
        require(
            randomTeamSelectorAddress != address(0),
            'governance/no-random-team-selector-address'
        );
        require(betAddress != address(0), 'no-bet-address-given');
        require(oneTime > 0, 'can-only-be-called-once');

        oneTime = oneTime - 1;
        randomTeamSelector = randomTeamSelectorAddress;
        bet = betAddress;
    }
}
