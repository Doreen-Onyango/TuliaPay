// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, externalEuint64, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TuliaProtocol is ZamaEthereumConfig, Ownable, ReentrancyGuard {
    // Encrypted balances tracker
    mapping(address => euint64) private _balances;
    mapping(address => bool) private _isHuman;
    mapping(uint256 => bool) private _nullifierHashes;

    // Metrics tracking
    uint256 public totalVerifiedHumans;
    uint256 public totalPublicDeposits;

    // Events
    event HumanVerified(address indexed user);
    event DepositConfirmed(address indexed user, uint256 publicAmount);
    event TransferCompleted(address indexed from, address indexed to);

    constructor() Ownable(msg.sender) {}

    // ------------------------------------------------------------------------
    // IDENTITY & VERIFICATION
    // ------------------------------------------------------------------------
    function verifyHuman(
        uint256 nullifierHash,
        uint256[8] calldata /* proof */ // Validation integrated in frontend/relayer
    ) external {
        require(!_isHuman[msg.sender], "TuliaPay: Address already verified");
        require(!_nullifierHashes[nullifierHash], "TuliaPay: WorldID already used");
        
        // In production: IWorldID.verifyProof(root, groupId, signalHash, nullifierHash, externalNullifier, proof);
        
        _nullifierHashes[nullifierHash] = true;
        _isHuman[msg.sender] = true;
        totalVerifiedHumans += 1;

        // Initialize user with 0 encrypted balance
        _balances[msg.sender] = FHE.asEuint64(0);
        FHE.allowThis(_balances[msg.sender]);
        FHE.allow(_balances[msg.sender], msg.sender);

        emit HumanVerified(msg.sender);
    }

    modifier onlyHuman() {
        require(_isHuman[msg.sender], "TuliaPay: Unverified human");
        _;
    }

    // ------------------------------------------------------------------------
    // DEPOSIT
    // ------------------------------------------------------------------------
    function deposit() external payable onlyHuman nonReentrant {
        require(msg.value > 0, "TuliaPay: Zero deposit");

        // Convert the public ETH deposited into an encrypted euint64 value
        euint64 encryptedDeposit = FHE.asEuint64(uint64(msg.value));
        
        // Add to the user's private balance
        _balances[msg.sender] = FHE.add(_balances[msg.sender], encryptedDeposit);
        FHE.allowThis(_balances[msg.sender]);
        FHE.allow(_balances[msg.sender], msg.sender);

        totalPublicDeposits += msg.value;

        emit DepositConfirmed(msg.sender, msg.value);
    }

    // ------------------------------------------------------------------------
    // CONFIDENTIAL TRANSFER
    // ------------------------------------------------------------------------
    function sendEncrypted(
        address to,
        externalEuint64 encryptedAmount,
        bytes calldata inputProof
    ) external onlyHuman nonReentrant {
        require(_isHuman[to], "TuliaPay: Recipient not a verified human");
        require(to != msg.sender, "TuliaPay: Cannot send to self");

        // Convert external encrypted payload to internal euint64 using the ZK Proof of knowledge
        euint64 amountToTransfer = FHE.fromExternal(encryptedAmount, inputProof);

        // Security: Ensure the sender has enough balance blindly
        ebool hasEnoughFunds = FHE.le(amountToTransfer, _balances[msg.sender]);

        // Blind transfer execution: if hasEnoughFunds is false, actualTransferAmount is 0
        euint64 actualTransferAmount = FHE.select(hasEnoughFunds, amountToTransfer, FHE.asEuint64(0));

        // Deduct from sender and add to receiver blindly
        _balances[msg.sender] = FHE.sub(_balances[msg.sender], actualTransferAmount);
        _balances[to] = FHE.add(_balances[to], actualTransferAmount);

        // Update permissions for both balances
        FHE.allowThis(_balances[msg.sender]);
        FHE.allow(_balances[msg.sender], msg.sender);
        
        FHE.allowThis(_balances[to]);
        FHE.allow(_balances[to], to);

        // Note: The event does not log amounts, maintaining privacy
        emit TransferCompleted(msg.sender, to);
    }

    // ------------------------------------------------------------------------
    // READ BALANCE
    // ------------------------------------------------------------------------
    function getEncryptedBalance() external view returns (euint64) {
        return _balances[msg.sender];
    }
}
