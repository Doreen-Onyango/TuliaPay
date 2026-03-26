// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IWorldID {
    function verifyProof(
        uint256 root,
        uint256 groupId,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifier,
        uint256[8] calldata proof
    ) external;
}

contract TuliaIdentity {
    IWorldID public immutable worldId;
    uint256 public immutable groupId;
    uint256 public immutable externalNullifier;

    mapping(address => bool) public isHumanVerified;
    mapping(uint256 => bool) public nullifierHashes;

    event HumanRegistered(address indexed user);

    constructor(
        IWorldID _worldId,
        string memory _appId,
        string memory _actionId
    ) {
        worldId = _worldId;
        groupId = 1;
        externalNullifier = uint256(keccak256(abi.encodePacked(_appId, _actionId))) >> 8;
    }

    function verifyAndRegister(
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        require(!isHumanVerified[msg.sender], "Address already verified");
        require(!nullifierHashes[nullifierHash], "Human already registered");

        uint256 signalHash = uint256(keccak256(abi.encodePacked(msg.sender))) >> 8;

        worldId.verifyProof(
            root,
            groupId,
            signalHash,
            nullifierHash,
            externalNullifier,
            proof
        );

        nullifierHashes[nullifierHash] = true;
        isHumanVerified[msg.sender] = true;

        emit HumanRegistered(msg.sender);
    }
}
