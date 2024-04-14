// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "hardhat/console.sol";

import {RedBlackTreeLib} from "./libraries/RedBlackTreeLib.sol";
import {OrderLinkedListLib} from "./libraries/OrderLinkedListLib.sol";
import {FixedPointMathLib} from "./libraries/FixedPointMathLib.sol";
import {OrdersLib} from "./libraries/OrdersLib.sol";
import {IBlackSea} from "./interfaces/IBlackSea.sol";

contract BlackSea is IBlackSea {
    using RedBlackTreeLib for RedBlackTreeLib.Tree;
    using OrderLinkedListLib for OrderLinkedListLib.OrderLinkedList;
    using OrderLinkedListLib for OrderLinkedListLib.OrderNode;
    using OrdersLib for OrdersLib.PairSideOrders;
    using OrdersLib for OrdersLib.Order;

    OrdersLib.PairSideOrders ordersAssetA;
    OrdersLib.PairSideOrders ordersAssetB;

    address assetA;
    address assetB;

    constructor(address addressA, address addressB) {
        assetA = addressA;
        assetB = addressB;
    }

    function placeOrder(
        address sellToken,
        // OrdersLib.Order(
        //     orderId,
        //     msg.sender,
        //     FixedPointMathLib.divWad(buyToken, sellToken),
        //     sellQuantity
        // );
        OrdersLib.Order calldata order
    ) external {
        if (sellToken == assetA) {
            ordersAssetA.appendOrder(order, ordersAssetB);
            return;
        }

        if (sellToken == assetB) {
            ordersAssetB.appendOrder(order, ordersAssetA);
            return;
        }

        revert("unsupported token");
    }
}
