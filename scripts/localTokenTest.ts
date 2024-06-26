// Usage: pnpm hardhat run --network <network> scripts/run-vigil.ts

import { ethers } from 'hardhat';
import * as sapphire from '@oasisprotocol/sapphire-paratime';

// eth_call (view calls) are signed by the RPC automatically (sapphira override)
// if we try to connect (contract.connect) to a different account, causes error
// as public key in Tx and signature are not going to match
async function main() {
    const signers = await ethers.getSigners();
    // const signer0 = 
    const signer0 = signers[0];
    console.log(signer0.address);

    const PrivateERC20 = await ethers.getContractFactory('PrivateERC20');
    const BalanceRegistry = await ethers.getContractFactory('ConfidentialBalanceRegistry');
    const Orderbook = await ethers.getContractFactory('BlackSea');

    const registry = await BalanceRegistry.deploy(
        signers[0].address,
        signers[0].address,
        signers[0].address,
    );
    const token = await PrivateERC20.deploy(
        {
            totalSupplyVisible: true,
            name: "fakeETH",
            symbol: "ETH",
            decimals: 18
        },
        "0xf6FdcacbA93A428A07d27dacEf1fBF25E2C65B0F",
        await registry.getAddress()
    );
    const token2 = await PrivateERC20.deploy(
        {
            totalSupplyVisible: true,
            name: "BlackSea",
            symbol: "BS",
            decimals: 18
        },
        "0xf6FdcacbA93A428A07d27dacEf1fBF25E2C65B0F",
        await registry.getAddress()
    );
    const tokenAddress = await token.getAddress();

    const orderbook = await Orderbook.deploy(tokenAddress, await token2.getAddress());


    console.log('Token ETH deployed at:', tokenAddress);
    console.log('Token BS deployed at:', await token2.getAddress());
    console.log('Orderbook deployed to: ', await orderbook.getAddress())

    const tx = await token.connect(signers[1]).mint(signer0.address, 1000);
    const tx2 = await token.mint(signers[1].address, 1000);

    console.log("balance:", await token.balanceOf(signers[1]));
    console.log("balance:", await token.balanceOf(signer0.address));

}

async function generateTraffic(n: number) {
    const signer = await ethers.provider.getSigner();
    for (let i = 0; i < n; i++) {
        await signer.sendTransaction({
            to: "0x000000000000000000000000000000000000dEaD",
            value: ethers.parseEther("1.0"),
            data: "0x"
        });
    };
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});