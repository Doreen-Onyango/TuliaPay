// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

    import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TuliaIdentity.sol";

abstract contract TuliaEncryptedBalance is ZamaEthereumConfig, ReentrancyGuard, TuliaIdentity {
    mapping(address => euint32) private balances;

    event Transfer(address indexed from, address indexed to);

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

    function transfer(address to, externalEuint32 encryptedAmount, bytes calldata inputProof) external onlyVerifiedHuman nonReentrant {
        require(to != address(0), "TuliaPay: Transfer to zero address");
        require(to != msg.sender, "TuliaPay: Cannot transfer to self");

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
