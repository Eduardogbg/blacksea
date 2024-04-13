// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

library Order {
    struct OrderNode {
        uint256 amount;
        address owner;
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

    function shift(OrderLinkedList storage list) internal {
        OrderNode storage node = getCurrentNode(list);
        list.currentIndex = node.next;
    }

    function append(
        OrderLinkedList storage list,
        OrderNode calldata node
    ) internal {
        assert(node.next == 0);

        OrderNode storage previousLast = list.nodes[list.last];
        assert(previousLast.next == 0);

        list.last += 1;
        list.nodes[list.last] = node;
        previousLast.next = list.last;
    }
}
