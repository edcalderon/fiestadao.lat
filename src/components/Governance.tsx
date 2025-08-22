"use client";

import { useState, useEffect } from "react";
import ProposalManagerForm from "./ProposalManagerForm";
import { useFiestaDAO } from "@/context/FiestaDAOContext";
import { formatEther, parseEther } from "ethers";

interface StakeInfo {
  stakedAmount: number;
  votingPower: number;
  rewards: number;
}

export function Governance() {
  const { 
    stakeTokens, 
    votingPower, 
    minStakeToPropose, 
    loading, 
    isConnected,
    refreshVotingPower
  } = useFiestaDAO();
  
  const [stakeAmount, setStakeAmount] = useState<string>("10"); // Default to 10 ASTR
  const [isStaking, setIsStaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Format values for display
  const minStakeFormatted = formatEther(minStakeToPropose || 0n);
  const userStakeFormatted = formatEther(votingPower || 0n);
  const hasEnoughStake = (votingPower || 0n) >= (minStakeToPropose || 0n);

  const handleStake = async () => {
    if (!isConnected) {
      setError("Por favor, conecta tu wallet para hacer staking de ASTR");
      return;
    }
    
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      setError("Por favor ingresa una cantidad válida para hacer staking");
      return;
    }
    
    // Clear any previous messages
    setError(null);
    setSuccess(null);
    
    // Set loading state
    setIsStaking(true);
    
    try {
      // Convert the amount to wei (18 decimals)
      const amountInWei = parseEther(stakeAmount);
      
      // Store the staked amount for the success message
      const stakedAmount = stakeAmount;
      
      // Call the stakeTokens function and wait for it to complete
      // This will throw an error if the transaction fails
      await stakeTokens(amountInWei);
      
      // If we get here, the transaction was successful
      // Refresh voting power to update the UI
      await refreshVotingPower();
      
      // Only show success message after everything is confirmed
      setSuccess(`¡${stakedAmount} ASTR stakeados exitosamente! Tu poder de voto ha aumentado.`);
      setStakeAmount("10");
    } catch (err: any) {
      console.error('Error staking tokens:', err);
      if (err.message?.includes('insufficient funds') || err.message?.includes('InsufficientBalance')) {
        setError(`Fondos insuficientes. No tienes suficientes ASTR en tu billetera para stakear ${stakeAmount} ASTR.`);
      } else {
        setError(err.message || 'Error al hacer stake de tokens. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsStaking(false);
    }
  };

  // For now, we'll keep the unstake function as a placeholder
  // since it requires a more complex implementation with timelocks
  const handleUnstake = async () => {
    alert("La función de desbloqueo de tokens estará disponible pronto. Actualmente, los tokens se bloquean durante 7 días después del desbloqueo.");
  };

  const [showProposalModal, setShowProposalModal] = useState(false);

  const handleCreateProposal = () => {
    if (!isConnected) {
      setError("Please connect your wallet to create a proposal");
      return;
    }
    
    if (!hasEnoughStake) {
      setError(`Necesitas al menos ${minStakeFormatted} ASTR stakeados para crear una propuesta.`);
      return;
    }
    
    setShowProposalModal(true);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        ⚡ Gobernanza ASTR
      </h2>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-lg p-4 border border-purple-400/30">
          <div className="text-purple-200 text-sm mb-1">ASTR Stakeados</div>
          <div className="text-2xl font-bold text-white">
            {parseFloat(userStakeFormatted).toFixed(2)}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-lg p-4 border border-green-400/30">
          <div className="text-green-200 text-sm mb-1">Poder de Voto</div>
          <div className="text-2xl font-bold text-white">
            {parseFloat(userStakeFormatted).toFixed(2)}
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-600/30 to-orange-600/30 rounded-lg p-4 border border-yellow-400/30">
          <div className="text-yellow-200 text-sm mb-1">Mínimo para Proponer</div>
          <div className="text-2xl font-bold text-white">
            {parseFloat(minStakeFormatted).toFixed(2)} ASTR
          </div>
        </div>
      </div>

      {/* Staking Section */}
      <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          🔒 Stake ASTR para Votar
        </h3>

        {!isConnected ? (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
            <p className="font-bold">Wallet no conectada</p>
            <p>Conecta tu billetera para comenzar a hacer staking de ASTR.</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                <p className="font-bold">¡Éxito!</p>
                <p>{success}</p>
              </div>
            )}
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="stake-amount" className="block text-sm font-medium text-white">
                  Cantidad de ASTR a stakear
                </label>
                <button 
                  type="button"
                  onClick={() => setStakeAmount("10")}
                  className="text-xs text-purple-300 hover:text-white transition-colors"
                >
                  Restablecer
                </button>
              </div>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="stake-amount"
                  value={stakeAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setStakeAmount(value);
                    }
                  }}
                  min="10"
                  step="0.1"
                  className="block w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
                  placeholder="10"
                  disabled={isStaking}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-white sm:text-sm">ASTR</span>
                </div>
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-white/60">
                  Mínimo recomendado: 10 ASTR
                </p>
                <p className="text-xs text-purple-300">
                  Saldo: {userStakeFormatted} ASTR
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleStake}
                disabled={isStaking || loading || !stakeAmount || parseFloat(stakeAmount) <= 0}
                className={`flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform ${
                  isStaking || loading || !stakeAmount || parseFloat(stakeAmount) <= 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:from-purple-700 hover:to-blue-700 hover:scale-105'
                }`}
              >
                {isStaking || loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Stakear {stakeAmount} ASTR
                  </span>
                )}
              </button>
            </div>
          </>
        )}

        <div className="text-purple-200 text-sm mb-4">
          💡 <strong>Ratio:</strong> 1 ASTR = 1 voto | <strong>APY:</strong> ~5%
          en recompensas
        </div>

        {votingPower > 0 && (
          <button
          onClick={handleUnstake}
          disabled={!isConnected || (votingPower || 0n) <= 0n}
          className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none mt-4"
        >
          🔓 Unstake Todo (7 días de espera)
        </button>
        )}
      </div>

      {/* Governance Actions */}
      <div className="space-y-3 mt-6">
        <h3 className="text-white font-semibold mb-2">Acciones de Gobernanza</h3>
        <button
          onClick={handleCreateProposal}
          disabled={!isConnected || !hasEnoughStake}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
        >
          <span>🗳️</span>
          <span>Crear Propuesta ({parseFloat(minStakeFormatted)} ASTR mínimo)</span>
        </button>
        
        {!hasEnoughStake && isConnected && (
          <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-3 rounded text-sm">
            <p>Necesitas al menos {parseFloat(minStakeFormatted)} ASTR stakeados para crear una propuesta.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/20">
          📊 Historial de Votos
        </button>
        <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/20">
          🏆 Ranking DAO
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-800/30 rounded-lg border border-blue-400/30">
        <p className="text-blue-200 text-sm text-center">
          🌟 <strong>Próximamente:</strong> Delegación de votos y propuestas
          automáticas basadas en IA.
        </p>
      </div>

      {/* Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Crear Nueva Propuesta</h3>
              <button 
                onClick={() => setShowProposalModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <ProposalManagerForm onClose={() => setShowProposalModal(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
