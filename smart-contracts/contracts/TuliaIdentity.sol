// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IWorldID {
    /// @notice Verifies a World ID proof.
    /// @param root The of the Merkle tree.
    /// @param groupId The group ID of the proof (usually 1 for Orb).
    /// @param signalHash A hash of the user's wallet address (signal).
    /// @param nullifierHash The user's nullifier hash (unique per user per action).
    /// @param externalNullifier The hash of the action ID.
    /// @param proof The zero-knowledge proof.
    function verifyProof(
        uint256 root,
        uint256 groupId,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external;
}

/// @title TuliaIdentity: Secure World ID Registration
/// @author TuliaPay
/// @notice Handles the verification and registration of real humans using World ID.
contract TuliaIdentity {
    /// @notice The World ID instance used for verification.
    IWorldID public immutable worldId;

    /// @notice The group ID we are verifying (1 = Orb verified).
    uint256 public immutable groupId;

    /// @notice The external nullifier (hash of the action ID).
    uint256 public immutable externalNullifier;

    /// @notice Mapping of wallet address to verification status.
    mapping(address => bool) public isHumanVerified;

    /// @notice Mapping of nullifiers to prevent duplicate registrations.
    mapping(uint256 => bool) public nullifierHashes;

    /// @notice Emitted when a human is successfully registered.
    event HumanRegistered(address indexed user);

    /**
     * @param _worldId The address of the WorldID router contract.
     * @param _appId The Worldcoin App ID.
     * @param _actionId The specific Action ID for TuliaPay.
     */
    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId
    ) {
        worldId = _worldId;
        groupId = 1; // Orbit verified group
        
        // Compute external nullifier according to World ID spec
        // external_nullifier = hash(app_id, action_id)
        externalNullifier = uint256(keccak256(abi.encodePacked(_appId, _actionId))) >> 8;
    }

    /**
     * @notice Verifies and registers a user as a verified human.
     * @param root The Merkle tree root.
     * @param nullifierHash The unique human identifier.
     * @param proof The ZK proof from IDKit.
     */
    function verifyAndRegister(
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        // 1. Ensure the user is not already verified in this context
        require(!isHumanVerified[msg.sender], "Address already verified");

        // 2. Ensure the unique human identifier (nullifier) hasn't been used before
        require(!nullifierHashes[nullifierHash], "Human already registered");

        // 3. Verify the proof against the World ID router
        // Signal is the msg.sender to bind the person to this wallet address
        uint256 signalHash = uint256(keccak256(abi.encodePacked(msg.sender))) >> 8;

        worldId.verifyProof(
            root,
            groupId,
            signalHash,
            nullifierHash,
            externalNullifier,
            proof
        );

        // 4. Mark as verified
        nullifierHashes[nullifierHash] = true;
        isHumanVerified[msg.sender] = true;

        emit HumanRegistered(msg.sender);
    }
}
