// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, externalEuint64, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TuliaIdentity.sol";

contract TuliaProtocol is ZamaEthereumConfig, Ownable, ReentrancyGuard, TuliaIdentity {
    mapping(address => euint64) private _balances;
    uint256 public totalPublicDeposits;

    event DepositConfirmed(address indexed user, uint256 publicAmount);
    event TransferCompleted(address indexed from, address indexed to);

    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId
    ) TuliaIdentity(_worldId, _appId, _actionId) Ownable(msg.sender) {}

    modifier onlyHuman() {
        require(isHumanVerified[msg.sender], "TuliaPay: Unverified human");
        _;
    }

    function deposit() external payable onlyHuman nonReentrant {
        require(msg.value > 0, "TuliaPay: Zero deposit");
        euint64 encryptedDeposit = FHE.asEuint64(uint64(msg.value));
        _balances[msg.sender] = FHE.add(_balances[msg.sender], encryptedDeposit);
        FHE.allowThis(_balances[msg.sender]);
        FHE.allow(_balances[msg.sender], msg.sender);
        totalPublicDeposits += msg.value;
        emit DepositConfirmed(msg.sender, msg.value);
    }

    function sendEncrypted(
        address to,
        externalEuint64 encryptedAmount,
        bytes calldata inputProof
    ) external onlyHuman nonReentrant {
        require(isHumanVerified[to], "TuliaPay: Recipient not a verified human");
        require(to != msg.sender, "TuliaPay: Cannot send to self");

        euint64 amountToTransfer = FHE.fromExternal(encryptedAmount, inputProof);
        ebool hasEnoughFunds = FHE.le(amountToTransfer, _balances[msg.sender]);
        euint64 actualTransferAmount = FHE.select(hasEnoughFunds, amountToTransfer, FHE.asEuint64(0));

        _balances[msg.sender] = FHE.sub(_balances[msg.sender], actualTransferAmount);
        _balances[to] = FHE.add(_balances[to], actualTransferAmount);

        FHE.allowThis(_balances[msg.sender]);
        FHE.allow(_balances[msg.sender], msg.sender);
        FHE.allowThis(_balances[to]);
        FHE.allow(_balances[to], to);

        emit TransferCompleted(msg.sender, to);
    }

    function getEncryptedBalance() external view returns (euint64) {
        return _balances[msg.sender];
    }
}
