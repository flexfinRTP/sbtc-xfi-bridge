// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockSBTCToken is ERC20, Ownable {
    uint256 public constant MINT_LIMIT = 1 * 10**16; // 0.01 sBTC

    constructor() ERC20("Mock sBTC Token", "msBTC") {
        _mint(msg.sender, 1000 * 10**decimals());
    }

    function publicMint() external {
        require(balanceOf(msg.sender) + MINT_LIMIT <= MINT_LIMIT, "Mint limit exceeded");
        _mint(msg.sender, MINT_LIMIT);
    }
}