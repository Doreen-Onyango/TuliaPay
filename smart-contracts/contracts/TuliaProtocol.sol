// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, externalEuint64, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TuliaIdentity.sol";

/**
 * @title TuliaProtocol
 * @author TuliaPay
 * @notice The main entry point for TuliaPay financial operations.
 * Inherits identity logic from TuliaIdentity to ensure strict human verification.
 */
contract TuliaProtocol is ZamaEthereumConfig, Ownable, ReentrancyGuard, TuliaIdentity {
    // Encrypted balances tracker
    mapping(address => euint64) private _balances;

    // Metrics tracking
    uint256 public totalPublicDeposits;

    // Events
    event DepositConfirmed(address indexed user, uint256 publicAmount);
    event TransferCompleted(address indexed from, address indexed to);

    /**
     * @param _worldId The WorldID router address.
     * @param _appId The Worldcoin App ID.
     * @param _actionId The TuliaPay action ID.
     */
    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId
    ) TuliaIdentity(_worldId, _appId, _actionId) Ownable(msg.sender) {}

    modifier onlyHuman() {
        require(isHumanVerified[msg.sender], "TuliaPay: Unverified human");
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
        require(isHumanVerified[to], "TuliaPay: Recipient not a verified human");
        require(to != msg.sender, "TuliaPay: Cannot send to self");

        // Convert external encrypted payload to internal euint64
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

        emit TransferCompleted(msg.sender, to);
    }

    // ------------------------------------------------------------------------
    // READ BALANCE
    // ------------------------------------------------------------------------
    function getEncryptedBalance() external view returns (euint64) {
        return _balances[msg.sender];
    }
}
