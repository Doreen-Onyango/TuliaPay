import { expect } from "chai";
import { ethers } from "hardhat";
import { TuliaEncryptedBalanceTest, MockWorldID } from "../types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("TuliaEncryptedBalance Identity Linkage", function () {
  let balanceTest: TuliaEncryptedBalanceTest;
  let mockWorldId: MockWorldID;
  let user1: HardhatEthersSigner;

  beforeEach(async function () {
    [, user1] = await ethers.getSigners();

    const MockWorldIDFactory = await ethers.getContractFactory("MockWorldID");
    mockWorldId = (await MockWorldIDFactory.deploy()) as MockWorldID;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const BalanceFactory = (await ethers.getContractFactory("TuliaEncryptedBalanceTest")) as any;
    balanceTest = (await BalanceFactory.deploy(
      await mockWorldId.getAddress(),
      "app_123",
      "action_123"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    )) as any;
  });

  describe("Verified Access Control", function () {
    it("Should reject unverified users", async function () {
      await expect(balanceTest.connect(user1).getEncryptedBalance())
        .to.be.revertedWith("TuliaPay: Unverified human");
    });

    it("Should allow verified users to interact", async function () {
      const root = 1;
      const nullifierHash = 123;
      const proof: [number, number, number, number, number, number, number, number] = [0,0,0,0,0,0,0,0];
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (balanceTest as any).connect(user1).verifyAndRegister(root, nullifierHash, proof);
      
      const balance = await balanceTest.connect(user1).getEncryptedBalance();
      expect(balance).to.not.equal(100);
    });

    it("Should allow verified users to deposit native asset", async function () {
      const root = 1;
      const nullifierHash = 456;
      const proof: [number, number, number, number, number, number, number, number] = [0,0,0,0,0,0,0,0];
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (balanceTest as any).connect(user1).verifyAndRegister(root, nullifierHash, proof);
      
      const depositValue = ethers.parseEther("0.0000000000000001"); // Small value for euint32 limit
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect((balanceTest as any).connect(user1).deposit({ value: depositValue }))
        .to.not.be.reverted;
    });
  });
});
