// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import {RedBlackTreeLib} from "./RedBlackTreeLib.sol";
import {OrderLinkedListLib} from "./OrderLinkedListLib.sol";
import {FixedPointMathLib} from "./FixedPointMathLib.sol";

import "../interfaces/IERC20.sol";

library OrdersLib {
    using RedBlackTreeLib for RedBlackTreeLib.Tree;
    using OrderLinkedListLib for OrderLinkedListLib.OrderLinkedList;
    using OrderLinkedListLib for OrderLinkedListLib.OrderNode;

    struct Order {
        uint256 orderId;
        address owner;
        address token;
        // base asset / quoted asset
        uint256 price;
        uint256 size;
    }

    struct PairSideOrders {
        RedBlackTreeLib.Tree priceTree;
        mapping(uint256 => OrderLinkedListLib.OrderLinkedList) ordersByPrice;
    }

    function insertOrder(
        PairSideOrders storage orders,
        Order calldata order
    ) internal {
        bytes32 pointer = orders.priceTree.find(order.price);
        if (RedBlackTreeLib.isEmpty(pointer)) {
            orders.priceTree.insert(order.price);
        }

        OrderLinkedListLib.OrderLinkedList storage priceOrders = orders
            .ordersByPrice[order.price];

        OrderLinkedListLib.OrderNode memory orderNode = OrderLinkedListLib
            .OrderNode(order.orderId, order.token, order.owner, order.size, 0);

        priceOrders.append(orderNode);
    }

    function matchAgainst(
        PairSideOrders storage againstOrders,
        Order calldata order
    ) internal returns (uint256) {
        console.log("matching against");
        uint256 unmatchedSize = order.size;

        while (true) {
            bytes32 ptr = againstOrders.priceTree.first();
            uint256 quotedPrice = RedBlackTreeLib.value(ptr);
            console.log("got quoted price of %s", quotedPrice);
            /*
                __|__Sell__|__Buy__
                A |    3   |   1
                B |    2   |   3
                
                (3 / 1) * (2 / 3) = 2 > 1
                there's a match!

                __|__Sell__|__Buy__
                A |    1   |   5
                B |    1   |   3

                (1/5) * (1/3) = 1/15 < 1
                there's no match.
            */
            if (
                FixedPointMathLib.mulWad(order.price, quotedPrice) <
                FixedPointMathLib.WAD
            ) {
                console.log("price didnt match");
                break;
            }

            OrderLinkedListLib.OrderLinkedList
                storage matchedOrders = againstOrders.ordersByPrice[
                    quotedPrice
                ];

            if (matchedOrders.currentIndex == 0) {
                console.log("price point is empty");
                break;
            }

            console.log("matched price %s", quotedPrice);

            do {
                OrderLinkedListLib.OrderNode
                    storage matchedOrder = matchedOrders.getCurrentNode();

                uint256 matchedSize = FixedPointMathLib.mulWad(
                    quotedPrice,
                    matchedOrder.size
                );

                console.log(
                    "matching against order %s with size %s",
                    matchedOrder.orderId,
                    matchedOrder.size
                );

                // TODO: transfers
                if (matchedSize > unmatchedSize) {
                    uint256 abacaba = matchedSize - unmatchedSize;

                    uint256 remainingSize = FixedPointMathLib.divWad(
                        abacaba,
                        quotedPrice
                    );

                    uint256 delta = matchedOrder.size - remainingSize;

                    matchedOrder.size = remainingSize;
                    unmatchedSize = 0;

                    console.log(
                        "completely matched order; against order remaining %s",
                        remainingSize
                    );

                    IERC20(matchedOrder.token).transfer(msg.sender, delta);
                    IERC20(order.token).transfer(matchedOrder.owner, abacaba);
                } else {
                    unmatchedSize -= matchedSize;

                    console.log(
                        "matched %s against %s; remaining %s",
                        matchedSize,
                        matchedOrder.size,
                        unmatchedSize
                    );

                    IERC20(matchedOrder.token).transfer(msg.sender, matchedOrder.size);
                    IERC20(order.token).transfer(matchedOrder.owner, matchedSize);

                    matchedOrders.shift();
                }
            } while (matchedOrders.hasCurrent() && unmatchedSize > 0);

            if (unmatchedSize != 0) {
                againstOrders.priceTree.remove(quotedPrice);
            }
        }

        return unmatchedSize;
    }

    function appendOrder(
        PairSideOrders storage orders,
        Order calldata order,
        PairSideOrders storage matchAgainstOrders
    ) internal {
        console.log("appending order with id %s", order.orderId);

        uint256 remainingSize = matchAgainst(matchAgainstOrders, order);

        if (remainingSize > 0) {
            console.log("size remaining %s; saving order", remainingSize);
            insertOrder(orders, order);
        }
    }
}
