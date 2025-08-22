"use client";

import { useState, useEffect } from "react";

interface AstarNetwork {
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

interface TokenBalance {
  astr: number;
  usd: number;
}

const ASTAR_ZKEVM_TESTNET: AstarNetwork = {
  chainId: 6038361,
  name: "Astar zkEVM Testnet",
  rpcUrl: "https://rpc.startale.com/astar-zkevm-testnet",
  blockExplorer: "https://astar-zkevm-testnet.blockscout.com",
  nativeCurrency: {
    name: "Astar",
    symbol: "ASTR",
    decimals: 18,
  },
};

export function AstarIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState<TokenBalance>({ astr: 0, usd: 0 });
  const [networkStatus, setNetworkStatus] = useState<
    "connected" | "wrong-network" | "disconnected"
  >("disconnected");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate connection check
    const checkConnection = () => {
      setBalance({ astr: 1250.75, usd: 187.61 });
      setIsConnected(true);
      setNetworkStatus("connected");
    };

    checkConnection();
  }, []);

  const handleConnectWallet = async () => {
    setIsLoading(true);

    try {
      // Simulate wallet connection
      setTimeout(() => {
        setIsConnected(true);
        setNetworkStatus("connected");
        setBalance({ astr: 1250.75, usd: 187.61 });
        setIsLoading(false);
        alert("¡Wallet conectada exitosamente a Astar zkEVM Testnet!");
      }, 2000);
    } catch (error) {
      setIsLoading(false);
      alert("Error al conectar wallet. Por favor, intenta nuevamente.");
    }
  };

  const handleSwitchNetwork = async () => {
    setIsLoading(true);

    try {
      // Simulate network switch
      setTimeout(() => {
        setNetworkStatus("connected");
        setIsLoading(false);
        alert("¡Red cambiada exitosamente a Astar zkEVM Testnet!");
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      alert("Error al cambiar de red. Por favor, intenta manualmente.");
    }
  };

  const handleGetTestTokens = () => {
    alert("Redirigiendo al faucet de Astar zkEVM Testnet...");
    window.open(
      "https://portal.astar.network/astar-zkevm-testnet/faucet",
      "_blank",
    );
  };

  const handleViewOnExplorer = () => {
    window.open(ASTAR_ZKEVM_TESTNET.blockExplorer, "_blank");
  };

  const getNetworkStatusColor = () => {
    switch (networkStatus) {
      case "connected":
        return "from-green-500 to-emerald-600";
      case "wrong-network":
        return "from-yellow-500 to-orange-600";
      default:
        return "from-red-500 to-pink-600";
    }
  };

  const getNetworkStatusText = () => {
    switch (networkStatus) {
      case "connected":
        return "✅ Conectado a Astar zkEVM";
      case "wrong-network":
        return "⚠️ Red Incorrecta";
      default:
        return "❌ Desconectado";
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        ⭐ Integración Astar
      </h2>

      {/* Network Status */}
      <div
        className={`bg-gradient-to-r ${getNetworkStatusColor()} rounded-lg p-4 mb-6 border border-white/20`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold">
              {getNetworkStatusText()}
            </h3>
            <p className="text-white/80 text-sm">{ASTAR_ZKEVM_TESTNET.name}</p>
          </div>
          {networkStatus === "wrong-network" && (
            <button
              onClick={handleSwitchNetwork}
              disabled={isLoading}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
            >
              {isLoading ? "⏳ Cambiando..." : "🔄 Cambiar Red"}
            </button>
          )}
        </div>
      </div>

      {/* Balance Display */}
      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-lg p-4 border border-purple-400/30">
            <div className="text-purple-200 text-sm mb-1">Balance ASTR</div>
            <div className="text-2xl font-bold text-white">
              {balance.astr.toLocaleString()}
            </div>
            <div className="text-purple-300 text-sm">
              ${balance.usd.toFixed(2)} USD
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-lg p-4 border border-green-400/30">
            <div className="text-green-200 text-sm mb-1">Poder de Voto</div>
            <div className="text-2xl font-bold text-white">
              {balance.astr.toFixed(0)}
            </div>
            <div className="text-green-300 text-sm">1 ASTR = 1 Voto</div>
          </div>
        </div>
      )}

      {/* Connection Actions */}
      <div className="space-y-3 mb-6">
        {!isConnected ? (
          <button
            onClick={handleConnectWallet}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? "⏳ Conectando..." : "🔗 Conectar Wallet"}
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGetTestTokens}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              🚰 Obtener ASTR Testnet
            </button>
            <button
              onClick={handleViewOnExplorer}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/20"
            >
              🔍 Ver en Explorer
            </button>
          </div>
        )}
      </div>

      {/* Network Information */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          🌐 Información de Red
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-purple-300">Chain ID:</span>
            <span className="text-white font-mono">
              {ASTAR_ZKEVM_TESTNET.chainId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-300">RPC URL:</span>
            <span className="text-white font-mono text-xs truncate max-w-48">
              {ASTAR_ZKEVM_TESTNET.rpcUrl}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-300">Símbolo:</span>
            <span className="text-white font-semibold">
              {ASTAR_ZKEVM_TESTNET.nativeCurrency.symbol}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-300">Decimales:</span>
            <span className="text-white">
              {ASTAR_ZKEVM_TESTNET.nativeCurrency.decimals}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-800/30 rounded-lg border border-blue-400/30">
        <p className="text-blue-200 text-sm text-center">
          ⚡ <strong>Astar zkEVM:</strong> Red de pruebas optimizada para dApps
          culturales con bajas comisiones.
        </p>
      </div>
    </div>
  );
}
