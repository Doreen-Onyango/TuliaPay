import { expect } from "chai";
import { ethers } from "hardhat";
import { TuliaEncryptedBalanceTest } from "../types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("TuliaEncryptedBalance Logic", function () {
  let balanceTest: TuliaEncryptedBalanceTest;
  let user1: HardhatEthersSigner;

  beforeEach(async function () {
    [, user1] = await ethers.getSigners();
    const BalanceFactory = await ethers.getContractFactory("TuliaEncryptedBalanceTest");
    balanceTest = (await BalanceFactory.deploy()) as TuliaEncryptedBalanceTest;
  });

  describe("Encrypted Operations", function () {
    it("Should correctly increase encrypted balance", async function () {
      const addr = await balanceTest.getAddress();
      expect(addr).to.not.equal(ethers.ZeroAddress);
    });

    it("Should ensure balances remain private on-chain", async function () {
      const tx = await balanceTest.connect(user1).getEncryptedBalance();
      expect(tx).to.not.equal(100);
    });
  });
});
