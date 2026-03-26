// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./TuliaEncryptedBalance.sol";
import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";

contract TuliaEncryptedBalanceTest is TuliaEncryptedBalance {
    function deposit(address user, externalEuint32 input_amount, bytes calldata input_proof) external {
        euint32 encrypted_amount = FHE.fromExternal(input_amount, input_proof);
        _increaseBalance(user, encrypted_amount);
    }

    function withdraw(address user, externalEuint32 input_amount, bytes calldata input_proof) external returns (ebool) {
        euint32 encrypted_amount = FHE.fromExternal(input_amount, input_proof);
        return _decreaseBalance(user, encrypted_amount);
    }
}
