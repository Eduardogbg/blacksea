// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

library OrderLinkedListLib {
    struct OrderNode {
        uint256 orderId;
        address token;
        address owner;
        uint256 size;
        uint256 next;
    }

    struct OrderLinkedList {
        mapping(uint256 => OrderNode) nodes;
        uint256 root;
        uint256 last;
        // We do this so we can have iterators and stuff
        uint256 currentIndex;
    }

    function getCurrentNode(
        OrderLinkedList storage list
    ) internal view returns (OrderNode storage node) {
        if (list.currentIndex == 0) {
            revert("null-pointer exception :)");
        }

        return list.nodes[list.currentIndex];
    }

    function hasCurrent(
        OrderLinkedList storage list
    ) internal view returns (bool) {
        return list.currentIndex != 0;
    }

    function shift(OrderLinkedList storage list) internal {
        OrderNode storage node = getCurrentNode(list);
        list.currentIndex = node.next;

        delete list.nodes[node.orderId];
    }

    function append(
        OrderLinkedList storage list,
        OrderNode memory node
    ) internal {
        assert(node.next == 0);
        list.nodes[node.orderId] = node;

        if (list.last != 0) {
            OrderNode storage previousLast = list.nodes[list.last];
            assert(previousLast.next == 0);
            previousLast.next = node.orderId;
        }

        if (list.currentIndex == 0) {
            list.currentIndex = node.orderId;
        }
    }
}
