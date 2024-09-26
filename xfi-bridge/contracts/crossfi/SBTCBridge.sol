// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SBTCBridge is Ownable, ReentrancyGuard {
    IERC20 public xfiToken;
    mapping(address => uint256) public userBalances;
    uint256 public bridgeReserve;
    uint256 public sbtcPrice;
    uint256 public xfiPrice;

    struct PendingWithdrawal {
        bytes32 stacksTxId;
        uint256 amount;
        address recipient;
    }

    mapping(bytes32 => PendingWithdrawal) public pendingWithdrawals;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event CrossChainTransferInitiated(address indexed user, uint256 amount, bytes32 stacksRecipient);
    event CrossChainTransferConfirmed(bytes32 indexed stacksTxId, address recipient, uint256 amount);

    constructor(address _xfiToken) {
        xfiToken = IERC20(_xfiToken);
    }

    function deposit(uint256 amount) external nonReentrant {
        require(xfiToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        userBalances[msg.sender] += amount;
        bridgeReserve += amount;
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        require(bridgeReserve >= amount, "Insufficient bridge reserve");
        userBalances[msg.sender] -= amount;
        bridgeReserve -= amount;
        require(xfiToken.transfer(msg.sender, amount), "Transfer failed");
        emit Withdraw(msg.sender, amount);
    }

    function initiateCrossChainTransfer(uint256 amount, bytes32 stacksRecipient) external nonReentrant {
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        userBalances[msg.sender] -= amount;
        bytes32 txId = keccak256(abi.encodePacked(block.timestamp, msg.sender, amount));
        pendingWithdrawals[txId] = PendingWithdrawal(stacksRecipient, amount, msg.sender);
        emit CrossChainTransferInitiated(msg.sender, amount, stacksRecipient);
    }

    function confirmCrossChainTransfer(bytes32 stacksTxId) external onlyOwner {
        PendingWithdrawal storage withdrawal = pendingWithdrawals[stacksTxId];
        require(withdrawal.amount > 0, "Invalid or already processed withdrawal");
        
        delete pendingWithdrawals[stacksTxId];
        userBalances[withdrawal.recipient] += withdrawal.amount;
        
        emit CrossChainTransferConfirmed(stacksTxId, withdrawal.recipient, withdrawal.amount);
    }

    function getUserBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }

    function getBridgeReserve() external view returns (uint256) {
        return bridgeReserve;
    }

    function updateBridgeReserve(uint256 newReserve) external onlyOwner {
        bridgeReserve = newReserve;
    }

    function updatePrices(uint256 newSbtcPrice, uint256 newXfiPrice) external onlyOwner {
        sbtcPrice = newSbtcPrice;
        xfiPrice = newXfiPrice;
    }
}