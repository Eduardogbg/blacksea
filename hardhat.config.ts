import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@oasisprotocol/sapphire-hardhat';

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
      viaIR: true,
    }
  },
  networks: {
    'sapphire-testnet': {
      // This is Testnet! If you want Mainnet, add a new network config item.
      url: "https://testnet.sapphire.oasis.io",
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY]
        : [],
      chainId: 0x5aff,
    },
    'sapphire-local': {
      url: "http://localhost:8545",
      accounts: [
        "0x160f52faa5c0aecfa26c793424a04d53cbf23dcad5901ce15b50c2e85b9d6ca7",
        "0x0ba685723b47d8e744b1b70a9bea9d4d968f60205385ae9de99865174c1af110",
        "0xfa990cf0c22af455d2734c879a2a844ff99bd779b400bb0e2919758d1be284b5"
      ],
      chainId: 0x5afd,
    }
  },
};

export default config;
