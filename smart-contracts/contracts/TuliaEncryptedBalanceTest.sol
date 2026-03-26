// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./TuliaEncryptedBalance.sol";
import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";

/**
 * @title TuliaEncryptedBalanceTest
 * @author TuliaPay
 * @notice Concrete implementation of TuliaEncryptedBalance to facilitate testing.
 */
contract TuliaEncryptedBalanceTest is TuliaEncryptedBalance {
    /**
     * @notice Exposed function to call internal _increaseBalance.
     * @param user The address of the recipient.
     * @param input_amount The external encrypted payload from the user.
     * @param input_proof The ZK-proof for the encrypted payload.
     */
    function deposit(address user, externalEuint32 input_amount, bytes calldata input_proof) external {
        euint32 encrypted_amount = FHE.fromExternal(input_amount, input_proof);
        _increaseBalance(user, encrypted_amount);
    }

    /**
     * @notice Exposed function to call internal _decreaseBalance.
     * @param user The address to deduct from.
     * @param input_amount The external encrypted payload from the user.
     * @param input_proof The ZK-proof for the encrypted payload.
     */
    function withdraw(address user, externalEuint32 input_amount, bytes calldata input_proof) external returns (ebool) {
        euint32 encrypted_amount = FHE.fromExternal(input_amount, input_proof);
        return _decreaseBalance(user, encrypted_amount);
    }
}
