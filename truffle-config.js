const HDWalletProvider = require("@truffle/hdwallet-provider");

// You'll need to create a private.json file with your private key
// Example: { "privateKey": "0x..." }
const { privateKey } = require("./private.json");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },

    // Shibuya faucet: use #shibuya-faucet room in https://discord.gg/astarnetwork
    shibuya: {
      provider: () =>
        new HDWalletProvider(privateKey, "https://evm.shibuya.astar.network"),
      network_id: 81,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },

    // Astar community faucet (please don't abuse): https://as-faucet.xyz/en/astar#
    astar: {
      provider: () =>
        new HDWalletProvider(privateKey, "https://evm.astar.network"),
      network_id: 592,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },

    // Shiden community faucet (please don't abuse): https://as-faucet.xyz/en/shiden#
    shiden: {
      provider: () =>
        new HDWalletProvider(privateKey, "https://evm.shiden.astar.network"),
      network_id: 336,
      gas: 5500000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },

  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
