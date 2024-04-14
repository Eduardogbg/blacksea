import { ethers } from 'ethers';
import * as sapphire from '@oasisprotocol/sapphire-paratime';
import { task } from "hardhat/config";
import dotenv from 'dotenv';
dotenv.config();

import abi from "../artifacts/contracts/confidentialERC20/PrivateERC20.sol/PrivateERC20.json";
import abiOrderbook from "../artifacts/contracts/BlackSea.sol/BlackSea.json";

task("checkBalance", "Checks balance for user")
    .setAction(async (taskArgs) => {
        const traderAddress = process.env.PRIVATE_KEY!;
        const tokenFakeEthAddress = process.env.TOKEN_ETH_ACCOUNT!;
        const tokenBlkSea = process.env.TOKEN_BLKSEA_ACCOUNT!;
        const signer = sapphire
            .wrap(new ethers.Wallet(traderAddress))
            .connect(ethers.getDefaultProvider(sapphire.NETWORKS.testnet.defaultGateway));

        const contractFakeEth = new ethers.Contract(tokenFakeEthAddress, abi.abi, signer);
        const contractBlkSea = new ethers.Contract(tokenFakeEthAddress, abi.abi, signer);

        const balanceFakeEth = await contractFakeEth.balanceOf(signer.address);
        const balanceBlkSea = await contractBlkSea.balanceOf(signer.address);

        console.log("Your current balance is:");
        console.log({
            balanceFakeEth,
            balanceBlkSea
        })


    });

task("mintTokens", "Mints both test tokens for the user")
    .addPositionalParam("quantity")
    .setAction(async (taskArgs) => {
        const traderAddress = process.env.PRIVATE_KEY!;
        const tokenFakeEthAddress = process.env.TOKEN_ETH_ACCOUNT!;
        const tokenBlkSea = process.env.TOKEN_BLKSEA_ACCOUNT!;
        const signer = sapphire
            .wrap(new ethers.Wallet(traderAddress))
            .connect(ethers.getDefaultProvider(sapphire.NETWORKS.testnet.defaultGateway));

        const contractFakeEth = new ethers.Contract(tokenFakeEthAddress, abi.abi, signer);
        const contractBlkSea = new ethers.Contract(tokenFakeEthAddress, abi.abi, signer);

        await contractFakeEth.mint(signer.address, taskArgs.quantity);
        await contractBlkSea.mint(signer.address, taskArgs.quantity);

        const balanceFakeEth = await contractFakeEth.balanceOf(signer.address);
        const balanceBlkSea = await contractBlkSea.balanceOf(signer.address);

        console.log(`You just requested ${taskArgs.quantity} tokens`);

    })


task("placeOrder", "Places a limit order in the orderbook")
    // .addPositionalParam("orderId")
    .addPositionalParam("token")
    .addPositionalParam("price")
    .addPositionalParam("size")
    .setAction(async (taskArgs) => {
        const traderAddress = process.env.PRIVATE_KEY!;
        const tokenFakeEthAddress = process.env.TOKEN_ETH_ACCOUNT!;
        const tokenBlkSea = process.env.TOKEN_BLKSEA_ACCOUNT!;
        const orderbook = process.env.ORDERBOOK_ACCOUNT!;
        const signer = sapphire
            .wrap(new ethers.Wallet(traderAddress))
            .connect(ethers.getDefaultProvider(sapphire.NETWORKS.testnet.defaultGateway));

        const contract = new ethers.Contract(orderbook, abiOrderbook.abi, signer);
        // const contractFakeEth = new ethers.Contract(tokenFakeEthAddress, abi.abi, signer);
        // const contractBlkSea = new ethers.Contract(tokenFakeEthAddress, abi.abi, signer);

        await contract.placeOrder(
            taskArgs.token,
            {
                orderId: Math.floor(Math.random() * 100000),
                owner: signer.address,
                token: taskArgs.token,
                price: taskArgs.price,
                size: taskArgs.size
            }
        );

        console.log(`You just requested placed an order`);

    })

task("checkOrders", "Returns pending orders for trader")
    .setAction(async (taskArgs) => {

        const traderAddress = process.env.PRIVATE_KEY!;
        const tokenFakeEthAddress = process.env.TOKEN_ETH_ACCOUNT!;
        const tokenBlkSea = process.env.TOKEN_BLKSEA_ACCOUNT!;
        const orderbook = process.env.ORDERBOOK_ACCOUNT!;
        const signer = sapphire
            .wrap(new ethers.Wallet(traderAddress))
            .connect(ethers.getDefaultProvider(sapphire.NETWORKS.testnet.defaultGateway));

        const contract = new ethers.Contract(orderbook, abiOrderbook.abi, signer);

        console.log(await contract.getAuthorOrders())

    })
