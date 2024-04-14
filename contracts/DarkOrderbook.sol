// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "hardhat/console.sol";

import {RedBlackTreeLib} from "./RedBlackTreeLib.sol";
import {OrderLinkedListLib} from "./OrderLinkedListLib.sol";
import {FixedPointMathLib} from "./FixedPointMathLib.sol";
import {OrdersLib} from "./OrdersLib.sol";

contract DarkOrderbook {
    using RedBlackTreeLib for RedBlackTreeLib.Tree;
    using OrderLinkedListLib for OrderLinkedListLib.OrderLinkedList;
    using OrderLinkedListLib for OrderLinkedListLib.OrderNode;
    using OrdersLib for OrdersLib.PairSideOrders;
    using OrdersLib for OrdersLib.Order;

    OrdersLib.PairSideOrders ordersAssetA;
    OrdersLib.PairSideOrders ordersAssetB;

    function abacaba(
        OrdersLib.Order[] calldata ordersA,
        OrdersLib.Order[] calldata ordersB
    ) public {
        //OrdersLib.Order(1, msg.sender, 2, 10)

        for (uint i = 0; i < ordersA.length; ++i) {
            ordersAssetA.appendOrder(ordersA[i], ordersAssetB);
        }

        for (uint i = 0; i < ordersB.length; ++i) {
            ordersAssetB.appendOrder(ordersB[i], ordersAssetA);
        }
    }
}
