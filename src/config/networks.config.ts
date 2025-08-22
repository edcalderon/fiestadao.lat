import { defineChain } from "thirdweb";

/**
 * @chain
 */
export const shibuyaTestnet = /* @__PURE__ */ defineChain({
  id: 81,
  name: "Shibuya Testnet",
  nativeCurrency: {
    name: "Shibuya",
    symbol: "SBY",
    decimals: 18,
  },
  rpc: "https://evm.shibuya.astar.network",
  blockExplorers: [
    {
      name: "Blockscout",
      url: "https://shibuya.blockscout.com",
    },
  ],
  testnet: true,
});

export const NETWORK_CONFIG = {
  defaultNetwork: shibuyaTestnet,
  supportedNetworks: [shibuyaTestnet],
} as const;

export type NetworkConfig = typeof shibuyaTestnet;
