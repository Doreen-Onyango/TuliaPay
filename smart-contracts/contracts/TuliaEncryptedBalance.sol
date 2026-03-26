// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/**
 * @title TuliaEncryptedBalance
 * @author TuliaPay
 * @notice A modular, privacy-preserving balance system using Zama's FHEVM.
 * Provides encrypted balance management with blind operations and comparisons.
 */
abstract contract TuliaEncryptedBalance is ZamaEthereumConfig {
    /// @dev Mapping to store encrypted balances as euint32.
    /// Privacy is guaranteed as the values are stored as ciphertexts.
    mapping(address => euint32) private balances;

    /**
     * @notice Returns the encrypted balance of the caller.
     * @return The encrypted balance (euint32 ciphertext).
     * @dev Accessing this on-chain does not reveal the underlying plaintext value.
     */
    function getEncryptedBalance() public view returns (euint32) {
        return balances[msg.sender];
    }

    /**
     * @dev Increases the encrypted balance of a specific user.
     * @param user The address of the recipient.
     * @param amount The encrypted amount (euint32) to add.
     */
    function _increaseBalance(address user, euint32 amount) internal {
        balances[user] = FHE.add(balances[user], amount);
        
        // Ensure the contract has permission to use this ciphertext in the future
        FHE.allowThis(balances[user]);
        // Allow the user to view their new balance
        FHE.allow(balances[user], user);
    }

    /**
     * @dev Decreases the encrypted balance of a specific user blindly.
     * Uses FHE comparison to ensure the balance doesn't go below zero without revealing the outcome.
     * @param user The address to deduct from.
     * @param amount The encrypted amount (euint32) to subtract.
     * @return success An encrypted boolean (ebool) indicating if the subtraction was valid (balance >= amount).
     */
    function _decreaseBalance(address user, euint32 amount) internal returns (ebool success) {
        // Blindly compare if balance is greater than or equal to amount
        success = FHE.ge(balances[user], amount);

        // If success is true, actualDeduction is 'amount', otherwise it's 0.
        // This keeps the balance positive and prevents underflow without a revert.
        euint32 actualDeduction = FHE.select(success, amount, FHE.asEuint32(0));

        balances[user] = FHE.sub(balances[user], actualDeduction);

        // Maintain permissions
        FHE.allowThis(balances[user]);
        FHE.allow(balances[user], user);

        return success;
    }
}
