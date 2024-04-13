import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const CONTRACT_NAME = "DarkOrderbook";

describe(CONTRACT_NAME, function () {
  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

    return { lock, unlockTime, lockedAmount, owner, otherAccount };
  }

  async function darkOrderbookFixture() {
    const [owner] = await ethers.getSigners();
    const DarkOrderbook = await ethers.getContractFactory(CONTRACT_NAME);

    return {
      orderbook: await DarkOrderbook.deploy(),
      owner
    }
  }

  describe("Deploymenta function", () => {
    it("Should set the right unlockTime", async function () {
      const { orderbook, owner } = await loadFixture(darkOrderbookFixture);

    });
  });
});
