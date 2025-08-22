export interface AstarNetwork {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface TokenBalance {
  astr: number;
  usd: number;
}

export type NetworkStatus = "connected" | "wrong-network" | "disconnected";
