// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import "./TuliaIdentity.sol";

abstract contract TuliaEncryptedBalance is ZamaEthereumConfig, TuliaIdentity {
    mapping(address => euint32) private balances;

    modifier onlyVerifiedHuman() {
        require(isHumanVerified[msg.sender], "TuliaPay: Unverified human");
        _;
    }

    function getEncryptedBalance() public view onlyVerifiedHuman returns (euint32) {
        return balances[msg.sender];
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
