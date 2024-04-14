import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { OrdersLib } from "../typechain-types/DarkOrderbook";

const CONTRACT_NAME = "DarkOrderbook";

const WAD = BigInt(1e18);

describe(CONTRACT_NAME, function () {
  async function darkOrderbookFixture() {
    const [owner] = await ethers.getSigners();
    const DarkOrderbook = await ethers.getContractFactory(CONTRACT_NAME);

    return {
      orderbook: await DarkOrderbook.deploy(),
      owner
    }
  }

  describe("abacaba", () => {
    it("tree insert then max works", async function () {
      const { orderbook, owner } = await loadFixture(darkOrderbookFixture);

      const ordersA: OrdersLib.OrderStruct[] = [
        {
          orderId: 1,
          owner,
          price: WAD,
          size: WAD,
        },
        {
          orderId: 2,
          owner,
          price: BigInt(5) * WAD / BigInt(6),
          size: WAD,
        }
      ];

      const ordersB: OrdersLib.OrderStruct[] = [
        {
          orderId: 37,
          owner,
          price: WAD,
          size: BigInt(10) * WAD,
        }
      ];

      const abacaba = await orderbook.abacaba(ordersA, ordersB);
    });
  });
});
