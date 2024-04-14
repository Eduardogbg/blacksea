// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {OrdersLib} from "../libraries/OrdersLib.sol";

interface IBlackSea {
    function placeOrder(
        address sellToken,
        OrdersLib.Order calldata order
    ) external;

    
}
