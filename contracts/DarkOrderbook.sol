// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "hardhat/console.sol";
import "./BokkyPooBahsRedBlackTreeLibrary.sol";

contract DarkOrderbook {
    using BokkyPooBahsRedBlackTreeLibrary for BokkyPooBahsRedBlackTreeLibrary.Tree;

    BokkyPooBahsRedBlackTreeLibrary.Tree tree;

    constructor() public {}

    function abacaba() internal returns (uint256) {
        tree.insert(2);
        tree.insert(5);

        return tree.max();
    }
}
