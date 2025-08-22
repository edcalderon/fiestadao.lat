"use client";

import { useState, useEffect } from "react";
import type { TokenBalance, NetworkStatus } from "@/types/network.types";
import { 
  ConnectButton, 
  useActiveAccount, 
  useSwitchActiveWalletChain, 
  useActiveWalletChain, 
  useWalletBalance 
} from "thirdweb/react";
import { client } from "@/app/client";
import { formatEther } from "viem";
import { createWallet } from "thirdweb/wallets";
import { shibuyaTestnet } from "@/config/networks.config";

export function AstarIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState<TokenBalance>({ astr: 0, usd: 0 });
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>("disconnected");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const account = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const switchChain = useSwitchActiveWalletChain();

  const { 
    data: walletBalance, 
    isLoading: isBalanceLoading, 
    isError: isBalanceError 
  } = useWalletBalance({
    chain: shibuyaTestnet,
    address: account?.address,
    client,
  });

  // Update balance and network status
  useEffect(() => {
    if (!account) {
      setIsConnected(false);
      setNetworkStatus("disconnected");
      return;
    }

    const isCorrectNetwork = activeChain?.id === shibuyaTestnet.id;
    setNetworkStatus(isCorrectNetwork ? "connected" : "wrong-network");
    setIsConnected(true);

    if (isCorrectNetwork && walletBalance) {
      const sbyBalance = parseFloat(formatEther(walletBalance.value));
      const usdValue = sbyBalance * 0.15; // Example conversion rate
      
      setBalance({ 
        astr: parseFloat(sbyBalance.toFixed(4)),
        usd: parseFloat(usdValue.toFixed(2))
      });
    }
  }, [account, activeChain, walletBalance]);

  const handleConnectWallet = async () => {
    if (isConnected) return;
    
    try {
      setIsLoading(true);
      const wallet = createWallet("io.metamask");
      await wallet.connect({ client });
      
      // Switch to Shibuya network after connection
      await switchChain(shibuyaTestnet);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert("Error al conectar wallet. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      setIsLoading(true);
      await switchChain(shibuyaTestnet);
      setNetworkStatus("connected");
    } catch (error) {
      console.error("Error switching network:", error);
      alert("Error al cambiar de red. Por favor, intenta manualmente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetTestTokens = () => {
    alert("Redirigiendo al faucet de Shibuya Testnet...");
    window.open("https://faucet.astar.network/shibuya", "_blank");
  };

  const handleViewOnExplorer = () => {
    if (shibuyaTestnet.blockExplorers?.[0]?.url) {
      window.open(shibuyaTestnet.blockExplorers[0].url, "_blank");
    }
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
        return "✅ Conectado a Shibuya";
      case "wrong-network":
        return "⚠️ Red Incorrecta";
      default:
        return "❌ Desconectado";
    }
  };

  const renderConnectionSection = () => (
    <div className="space-y-3">
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
  );

  const renderCollapsedContent = () => (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold">
            {getNetworkStatusText()}
          </h3>
          <p className="text-white/80 text-sm">{shibuyaTestnet.name}</p>
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
  );

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
      {/* Collapsed State */}
      {!isExpanded ? (
        <div>
          <div 
            className="p-4 cursor-pointer hover:bg-white/5 transition-colors flex justify-between items-center"
            onClick={() => setIsExpanded(true)}
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              ⭐ Integración Astar
            </h2>
            <span className="text-white/60 text-2xl">+</span>
          </div>
          {renderCollapsedContent()}
        </div>
      ) : (
        <>
          {/* Header with expand/collapse button */}
          <div 
            className="p-4 cursor-pointer hover:bg-white/5 transition-colors flex justify-between items-center"
            onClick={() => setIsExpanded(false)}
          >
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              ⭐ Integración Astar
            </h2>
            <span className="text-white/60 text-2xl">−</span>
          </div>

          {/* Expanded content */}
          <div className="px-6 pb-6">
            {/* Network Status */}
            <div
              className={`bg-gradient-to-r ${getNetworkStatusColor()} rounded-lg p-4 mb-6 border border-white/20`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold">
                    {getNetworkStatusText()}
                  </h3>
                  <ConnectButton
                    client={client}
                    appMetadata={{
                      name: "FiestaDAO",
                      url: "https://fiestadao.com",
                    }}
                  />
                  <p className="text-white/80 text-sm">{shibuyaTestnet.name}</p>
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
              {renderConnectionSection()}
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
                    {shibuyaTestnet.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">RPC URL:</span>
                  <span className="text-white font-mono text-xs truncate max-w-48">
                    {shibuyaTestnet.rpc}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Símbolo:</span>
                  <span className="text-white font-semibold">
                    {shibuyaTestnet.nativeCurrency?.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Decimales:</span>
                  <span className="text-white">
                    {shibuyaTestnet.nativeCurrency?.decimals}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-800/30 rounded-lg border border-blue-400/30">
              <p className="text-blue-200 text-sm text-center">
                ⚡ <strong>Shibuya Testnet:</strong> Red de pruebas de Astar Network para desarrollo y pruebas de dApps.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
