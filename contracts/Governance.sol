// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/utils/Counters.sol';

contract Governance {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    uint256 public oneTime;
    address public bet;
    address public randomTeamSelector;

    constructor() {
        _tokenIdCounter.increment();
        oneTime = _tokenIdCounter.current();
        // oneTime = 1;
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

        randomTeamSelector = randomTeamSelectorAddress;
        bet = betAddress;

        _tokenIdCounter.decrement();
        oneTime = _tokenIdCounter.current();
    }
}
