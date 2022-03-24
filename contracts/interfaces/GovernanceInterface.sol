pragma solidity ^0.8.0;

interface GovernanceInterface {
    function bet() external view returns (address);

    function randomness() external view returns (address);
}
