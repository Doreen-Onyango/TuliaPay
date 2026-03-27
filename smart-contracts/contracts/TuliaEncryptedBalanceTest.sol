// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./TuliaEncryptedBalance.sol";
import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";

contract TuliaEncryptedBalanceTest is TuliaEncryptedBalance {
    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId
    ) TuliaIdentity(_worldId, _appId, _actionId) Ownable(msg.sender) {}

    function depositEncrypted(address user, externalEuint32 input_amount, bytes calldata input_proof) external onlyVerifiedHuman {
        euint32 encrypted_amount = FHE.fromExternal(input_amount, input_proof);
        _increaseBalance(user, encrypted_amount);
    }

    function withdraw(address user, externalEuint32 input_amount, bytes calldata input_proof) external onlyVerifiedHuman returns (ebool) {
        euint32 encrypted_amount = FHE.fromExternal(input_amount, input_proof);
        return _decreaseBalance(user, encrypted_amount);
    }
}
