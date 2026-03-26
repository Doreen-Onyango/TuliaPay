// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./TuliaIdentity.sol";

contract MockWorldID is IWorldID {
    bool public shouldFail;

    function setShouldFail(bool _shouldFail) external {
        shouldFail = _shouldFail;
    }

    function verifyProof(
        uint256 /* root */,
        uint256 /* groupId */,
        uint256 /* signalHash */,
        uint256 /* nullifierHash */,
        uint256 /* externalNullifier */,
        uint256[8] calldata /* proof */
    ) external view {
        if (shouldFail) {
            revert("MockWorldID: Proof verification failed");
        }
        // In this mock, if shouldFail is false, the proof is always considered valid
    }
}
