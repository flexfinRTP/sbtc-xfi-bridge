// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockSTXToken is ERC20, Ownable {
    uint256 public constant MINT_LIMIT = 100 * 10**18; // 100 STX

    constructor() ERC20("Mock STX Token", "mSTX") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function publicMint() external {
        require(balanceOf(msg.sender) + MINT_LIMIT <= MINT_LIMIT, "Mint limit exceeded");
        _mint(msg.sender, MINT_LIMIT);
    }
}