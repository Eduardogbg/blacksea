import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { OrdersLib } from "../typechain-types/contracts/BlackSea";

const CONTRACT_NAME = "BlackSea";

const WAD = BigInt(1e18);

describe(CONTRACT_NAME, function () {
  let addressA: string, addressB: string;

  async function darkOrderbookFixture() {
    const [owner, _, signerA, signerB] = await ethers.getSigners();
    const BlackSea = await ethers.getContractFactory(CONTRACT_NAME);

    addressA = await signerA.getAddress();
    addressB = await signerB.getAddress();

    return {
      blacksea: await BlackSea.deploy(
        addressA,
        addressB
      ),
      owner
    }
  }

  describe("abacaba", () => {
    it("tree insert then max works", async function () {
      const { blacksea, owner } = await loadFixture(darkOrderbookFixture);

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
          price: BigInt(6) * WAD / BigInt(5),
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

      await blacksea.placeOrder(
        addressA,
        ordersA[0]
      );

      await blacksea.placeOrder(
        addressA,
        ordersA[1]
      );

      await blacksea.placeOrder(
        addressB,
        ordersB[0]
      );
    });
  });
});
