// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SBTCBridge is Ownable, ReentrancyGuard {
    IERC20 public xfiToken;
    IERC20 public sbtcToken;
    IERC20 public stxToken;

    mapping(address => mapping(address => uint256)) public userBalances;
    uint256 public bridgeReserve;
    
    struct TokenPrices {
        uint256 sbtcPrice;
        uint256 xfiPrice;
        uint256 stxPrice;
    }

    TokenPrices public prices;

    struct PendingWithdrawal {
        bytes32 stacksTxId;
        uint256 amount;
        address token;
        address recipient;
    }

    mapping(bytes32 => PendingWithdrawal) public pendingWithdrawals;

    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    event CrossChainTransferInitiated(address indexed user, address indexed token, uint256 amount, bytes32 stacksRecipient);
    event CrossChainTransferConfirmed(bytes32 indexed stacksTxId, address recipient, address token, uint256 amount);
    event PricesUpdated(uint256 newSbtcPrice, uint256 newXfiPrice, uint256 newStxPrice);

    constructor(address _xfiToken, address _sbtcToken, address _stxToken) {
        xfiToken = IERC20(_xfiToken);
        sbtcToken = IERC20(_sbtcToken);
        stxToken = IERC20(_stxToken);
    }

    function deposit(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(token == address(xfiToken) || token == address(sbtcToken) || token == address(stxToken), "Invalid token");
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        userBalances[token][msg.sender] += amount;
        bridgeReserve += amount;
        emit Deposit(msg.sender, token, amount);
    }

    function withdraw(address token, uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(userBalances[token][msg.sender] >= amount, "Insufficient balance");
        require(bridgeReserve >= amount, "Insufficient bridge reserve");
        userBalances[token][msg.sender] -= amount;
        bridgeReserve -= amount;
        require(IERC20(token).transfer(msg.sender, amount), "Transfer failed");
        emit Withdraw(msg.sender, token, amount);
    }

    function initiateCrossChainTransfer(address token, uint256 amount, bytes32 stacksRecipient) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(userBalances[token][msg.sender] >= amount, "Insufficient balance");
        userBalances[token][msg.sender] -= amount;
        bytes32 txId = keccak256(abi.encodePacked(block.timestamp, msg.sender, token, amount));
        pendingWithdrawals[txId] = PendingWithdrawal(stacksRecipient, amount, token, msg.sender);
        emit CrossChainTransferInitiated(msg.sender, token, amount, stacksRecipient);
    }

    function confirmCrossChainTransfer(bytes32 stacksTxId) external onlyOwner {
        PendingWithdrawal storage withdrawal = pendingWithdrawals[stacksTxId];
        require(withdrawal.amount > 0, "Invalid or already processed withdrawal");
        
        delete pendingWithdrawals[stacksTxId];
        userBalances[withdrawal.token][withdrawal.recipient] += withdrawal.amount;
        
        emit CrossChainTransferConfirmed(stacksTxId, withdrawal.recipient, withdrawal.token, withdrawal.amount);
    }

    function getUserBalance(address user, address token) external view returns (uint256) {
        return userBalances[token][user];
    }

    function getBridgeReserve() external view returns (uint256) {
        return bridgeReserve;
    }

    function updateBridgeReserve(uint256 newReserve) external onlyOwner {
        bridgeReserve = newReserve;
    }

    function updatePrices(uint256 newSbtcPrice, uint256 newXfiPrice, uint256 newStxPrice) external onlyOwner {
        require(newSbtcPrice > 0 && newXfiPrice > 0 && newStxPrice > 0, "Invalid price");
        prices = TokenPrices(newSbtcPrice, newXfiPrice, newStxPrice);
        emit PricesUpdated(newSbtcPrice, newXfiPrice, newStxPrice);
    }
}