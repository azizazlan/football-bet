// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface GovernanceInterface {
    function bet() external view returns (address);

    function randomTeamSelector() external view returns (address);
}
