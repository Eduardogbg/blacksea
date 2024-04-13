// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "hardhat/console.sol";

interface ISettlementEngine {
    
    function _escrowFunds(
        address token,
        address trader,
        uint256 amount
    ) internal;

    function _releaseFunds(
        address token,
        address trader,
        uint256 amount
    ) internal;

}
