// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "hardhat/console.sol";

interface IBlackSea {
    
    function placeOrder(
        address sellToken,
        address buyToken,
        uint128 sellQuantity,
        uint128 buyQuantity
    ) external;

    function cancelOrder(
        uint256 orderId
    ) external;

    
}
