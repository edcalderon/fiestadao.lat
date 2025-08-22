import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from 'dotenv';
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "shibuya",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    shibuya: {
      url: 'https://evm.shibuya.astar.network',
      chainId: 81,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  },
  etherscan: {
    apiKey: {
      shibuya: process.env.ETHERSCAN_API_KEY || '',
    },
    customChains: [
      {
        network: "shibuya",
        chainId: 81,
        urls: {
          apiURL: "https://blockscout.com/shibuya/api",
          browserURL: "https://shibuya.subscan.io/"
        }
      }
    ]
  },
};

export default config;
