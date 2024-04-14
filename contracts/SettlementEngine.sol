// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "hardhat/console.sol";
import "./interfaces/IERC20.sol";

contract SettlementEngine {
    constructor() public {}

    function _escrowFunds(
        IERC20 _token,
        address _trader,
        uint256 _amount
    ) internal {
        _token.transferFrom(_trader, address(this), _amount);
    }

    function _releaseFunds(
        IERC20 _token,
        address _trader,
        uint256 _amount
    ) internal {
        _token.transfer(_trader, _amount);
    }
}
