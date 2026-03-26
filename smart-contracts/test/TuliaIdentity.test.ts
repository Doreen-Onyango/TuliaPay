import { expect } from "chai";
import { ethers } from "hardhat";
import { TuliaIdentity, MockWorldID } from "../types";

import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("TuliaIdentity Verification Flow", function () {
  let identity: TuliaIdentity;
  let mockWorldId: MockWorldID;
  let user1: HardhatEthersSigner, user2: HardhatEthersSigner;

  const appId = "app_123456789";
  const actionId = "verify-human";

  beforeEach(async function () {
    [, user1, user2] = await ethers.getSigners();

    // Deploy Mock World ID
    const MockWorldIDFactory = await ethers.getContractFactory("MockWorldID");
    mockWorldId = (await MockWorldIDFactory.deploy()) as MockWorldID;

    // Deploy TuliaIdentity
    const TuliaIdentityFactory = await ethers.getContractFactory("TuliaIdentity");
    identity = (await TuliaIdentityFactory.deploy(
      await mockWorldId.getAddress(),
      appId,
      actionId
    )) as TuliaIdentity;
  });

  describe("Deployment", function () {
    it("Should correctly set the WorldID address", async function () {
      expect(await identity.worldId()).to.equal(await mockWorldId.getAddress());
    });

    it("Should set the correct groupId of 1", async function () {
      expect(await identity.groupId()).to.equal(1);
    });
  });

  describe("Verification and Registration", function () {
    const root = 123456789;
    const nullifierHash = 987654321;
    const dummyProof: [number, number, number, number, number, number, number, number] = [
      0, 0, 0, 0, 0, 0, 0, 0
    ];

    it("Should successfully register a new human", async function () {
      await expect(identity.connect(user1).verifyAndRegister(root, nullifierHash, dummyProof))
        .to.emit(identity, "HumanRegistered")
        .withArgs(user1.address);

      expect(await identity.isHumanVerified(user1.address)).to.equal(true);
      expect(await identity.nullifierHashes(nullifierHash)).to.equal(true);
    });

    it("Should reject if a human (nullifier) is already registered", async function () {
      await identity.connect(user1).verifyAndRegister(root, nullifierHash, dummyProof);
      
      // Attempt registration with a different address but the SAME nullifier (duplicate human attempt)
      await expect(identity.connect(user2).verifyAndRegister(root, nullifierHash, dummyProof))
        .to.be.revertedWith("Human already registered");
    });

    it("Should reject if an address is already verified", async function () {
      await identity.connect(user1).verifyAndRegister(root, nullifierHash, dummyProof);
      
      // Attempt registration again with the same address but a NEW nullifier
      const newNullifier = 111222333;
      await expect(identity.connect(user1).verifyAndRegister(root, newNullifier, dummyProof))
        .to.be.revertedWith("Address already verified");
    });

    it("Should fail registration if the WorldID proof is invalid", async function () {
      await mockWorldId.setShouldFail(true);
      
      await expect(identity.connect(user1).verifyAndRegister(root, nullifierHash, dummyProof))
        .to.be.revertedWith("MockWorldID: Proof verification failed");
    });
  });
});
