// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TuliaIdentity.sol";

abstract contract TuliaEncryptedBalance is ZamaEthereumConfig, Ownable, ReentrancyGuard, TuliaIdentity {
    mapping(address => euint32) private balances;
    mapping(address => bytes32) public pendingWithdrawals;
    mapping(address => euint32) public lockedWithdrawalAmounts;
    mapping(address => uint256) public withdrawalTimestamps;
    mapping(address => uint256) public claimablePublicETH;
    mapping(address => uint256) public nonces;
    uint256 public constant WITHDRAWAL_TIMEOUT = 1 hours;

    event Transfer(address indexed from, address indexed to);
    event WithdrawalRequested(address indexed user, bytes32 indexed handle);
    event WithdrawalCancelled(address indexed user);
    event WithdrawalCompleted(address indexed user, uint32 amount);

    modifier onlyVerifiedHuman() {
        require(isHumanVerified[msg.sender], "TuliaPay: Unverified human");
        _;
    }

    function deposit() external payable onlyVerifiedHuman nonReentrant {
        require(msg.value > 0, "TuliaPay: Zero deposit");
        require(msg.value <= type(uint32).max, "TuliaPay: Deposit too large");
        euint32 encryptedDeposit = FHE.asEuint32(uint32(msg.value));
        _increaseBalance(msg.sender, encryptedDeposit);
    }

    function getEncryptedBalance() public view onlyVerifiedHuman returns (euint32) {
        return balances[msg.sender];
    }

    function transfer(address to, externalEuint32 encryptedAmount, bytes calldata inputProof, uint256 nonce) external onlyVerifiedHuman nonReentrant {
        require(to != address(0), "TuliaPay: Transfer to zero address");
        require(to != msg.sender, "TuliaPay: Cannot transfer to self");
        require(nonce == nonces[msg.sender]++, "TuliaPay: Invalid nonce");

        euint32 amount = FHE.fromExternal(encryptedAmount, inputProof);

        ebool isSufficient = FHE.ge(balances[msg.sender], amount);
        euint32 actualTransferAmount = FHE.select(isSufficient, amount, FHE.asEuint32(0));

        balances[msg.sender] = FHE.sub(balances[msg.sender], actualTransferAmount);
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);

        balances[to] = FHE.add(balances[to], actualTransferAmount);
        FHE.allowThis(balances[to]);
        FHE.allow(balances[to], to);

        emit Transfer(msg.sender, to);
    }

    function requestWithdrawal(externalEuint32 encryptedAmount, bytes calldata inputProof, uint256 nonce) external onlyVerifiedHuman nonReentrant {
        require(pendingWithdrawals[msg.sender] == bytes32(0), "TuliaPay: Existing pending withdrawal");
        require(nonce == nonces[msg.sender]++, "TuliaPay: Invalid nonce");

        euint32 amountToWithdraw = FHE.fromExternal(encryptedAmount, inputProof);
        ebool hasEnoughFunds = FHE.ge(balances[msg.sender], amountToWithdraw);
        
        euint32 approvedWithdrawal = FHE.select(hasEnoughFunds, amountToWithdraw, FHE.asEuint32(0));

        balances[msg.sender] = FHE.sub(balances[msg.sender], approvedWithdrawal);
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);

        FHE.makePubliclyDecryptable(approvedWithdrawal);
        bytes32 handle = FHE.toBytes32(approvedWithdrawal);
        
        pendingWithdrawals[msg.sender] = handle;
        lockedWithdrawalAmounts[msg.sender] = approvedWithdrawal;
        withdrawalTimestamps[msg.sender] = block.timestamp;
        
        FHE.allowThis(approvedWithdrawal);
        FHE.allow(approvedWithdrawal, msg.sender);

        emit WithdrawalRequested(msg.sender, handle);
    }

    function cancelStalledWithdrawal() external onlyVerifiedHuman nonReentrant {
        require(pendingWithdrawals[msg.sender] != bytes32(0), "TuliaPay: No pending withdrawal");
        require(block.timestamp >= withdrawalTimestamps[msg.sender] + WITHDRAWAL_TIMEOUT, "TuliaPay: Withdrawal not expired");

        balances[msg.sender] = FHE.add(balances[msg.sender], lockedWithdrawalAmounts[msg.sender]);
        FHE.allowThis(balances[msg.sender]);
        FHE.allow(balances[msg.sender], msg.sender);

        pendingWithdrawals[msg.sender] = bytes32(0);
        withdrawalTimestamps[msg.sender] = 0;

        emit WithdrawalCancelled(msg.sender);
    }

    function fulfillWithdrawal(address user, bytes memory abiEncodedCleartexts, bytes memory decryptionProof) external onlyOwner nonReentrant {
        bytes32 handle = pendingWithdrawals[user];
        require(handle != bytes32(0), "TuliaPay: No pending withdrawal");

        bytes32[] memory handlesList = new bytes32[](1);
        handlesList[0] = handle;

        require(FHE.isPublicDecryptionResultValid(handlesList, abiEncodedCleartexts, decryptionProof), "TuliaPay: Invalid decryption proof");

        uint32 decryptedAmount = abi.decode(abiEncodedCleartexts, (uint32));
        
        pendingWithdrawals[user] = bytes32(0);
        withdrawalTimestamps[user] = 0;
        
        if (decryptedAmount > 0) {
            (bool success, ) = payable(user).call{value: decryptedAmount}("");
            if (!success) {
                claimablePublicETH[user] += decryptedAmount;
            }
        }
        
        emit WithdrawalCompleted(user, decryptedAmount);
    }

    function claimPublicETH() external nonReentrant {
        uint256 amount = claimablePublicETH[msg.sender];
        require(amount > 0, "TuliaPay: No ETH to claim");
        
        claimablePublicETH[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "TuliaPay: Claim failed");
    }

    function _increaseBalance(address user, euint32 amount) internal {
        balances[user] = FHE.add(balances[user], amount);
        FHE.allowThis(balances[user]);
        FHE.allow(balances[user], user);
    }

    function _decreaseBalance(address user, euint32 amount) internal returns (ebool success) {
        success = FHE.ge(balances[user], amount);
        euint32 actualDeduction = FHE.select(success, amount, FHE.asEuint32(0));
        balances[user] = FHE.sub(balances[user], actualDeduction);
        FHE.allowThis(balances[user]);
        FHE.allow(balances[user], user);
        return success;
    }
}
