// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "hardhat/console.sol";

import {RedBlackTreeLib} from "./libraries/RedBlackTreeLib.sol";
import {OrderLinkedListLib} from "./libraries/OrderLinkedListLib.sol";
import {FixedPointMathLib} from "./libraries/FixedPointMathLib.sol";
import {OrdersLib} from "./libraries/OrdersLib.sol";
import {IBlackSea} from "./interfaces/IBlackSea.sol";
import {SettlementEngine} from "./SettlementEngine.sol";

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

    // TODO: shove indices down the libs and purge them when needed
    mapping(uint256 => OrdersLib.Order) ordersById;
    mapping(address => uint256[]) authorOrders;

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
        ordersById[order.orderId] = order;
        assert(msg.sender == order.owner);
        uint256[] storage senderOrders = authorOrders[order.owner];
        senderOrders.push() = order.orderId;

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

    function getOrder(
        uint256 orderId
    ) external view returns (OrdersLib.Order memory) {
        return ordersById[orderId];
    }

    function getAuthorOrders()
        external
        view
        returns (OrdersLib.Order[] memory)
    {
        uint256[] storage senderOrders = authorOrders[msg.sender];

        OrdersLib.Order[] memory orders = new OrdersLib.Order[](
            senderOrders.length
        );

        for (uint32 i = 0; i < senderOrders.length; ++i) {
            orders[i] = ordersById[senderOrders[i]];
        }

        return orders;
    }
}
