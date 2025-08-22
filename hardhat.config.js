require("@nomicfoundation/hardhat-toolbox");

// You'll need to create a private.json file with your private key
// Example: { "privateKey": "0x..." }
const { privateKey } = require("./private.json");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    // Shibuya faucet: use #shibuya-faucet room in https://discord.gg/astarnetwork
    shibuya: {
      url: "https://evm.shibuya.astar.network",
      chainId: 81,
      accounts: [privateKey],
    },

    // Astar community faucet (please don't abuse): https://as-faucet.xyz/en/astar#
    astar: {
      url: "https://evm.astar.network",
      chainId: 592,
      accounts: [privateKey],
    },

    // Shiden community faucet (please don't abuse): https://as-faucet.xyz/en/shiden#
    shiden: {
      url: "https://evm.shiden.astar.network",
      chainId: 336,
      accounts: [privateKey],
    },
  },
};
