"use client";

import { useState } from "react";

interface StakeInfo {
  stakedAmount: number;
  votingPower: number;
  rewards: number;
}

export function Governance() {
  const [stakeAmount, setStakeAmount] = useState<string>("");
  const [userStake, setUserStake] = useState<StakeInfo>({
    stakedAmount: 500,
    votingPower: 500,
    rewards: 12.5,
  });
  const [isStaking, setIsStaking] = useState(false);

  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) return;

    setIsStaking(true);
    // Simulate staking transaction
    setTimeout(() => {
      const amount = parseFloat(stakeAmount);
      setUserStake((prev) => ({
        stakedAmount: prev.stakedAmount + amount,
        votingPower: prev.votingPower + amount,
        rewards: prev.rewards + amount * 0.025,
      }));
      setStakeAmount("");
      setIsStaking(false);
      alert(
        `¡${amount} ASTR stakeados exitosamente! Tu poder de voto ha aumentado.`,
      );
    }, 2000);
  };

  const handleUnstake = async () => {
    if (userStake.stakedAmount <= 0) return;

    setIsStaking(true);
    // Simulate unstaking transaction
    setTimeout(() => {
      alert(
        `¡${userStake.stakedAmount} ASTR desbloqueados! Recibirás tus tokens en 7 días.`,
      );
      setUserStake({
        stakedAmount: 0,
        votingPower: 0,
        rewards: 0,
      });
      setIsStaking(false);
    }, 2000);
  };

  const handleCreateProposal = () => {
    if (userStake.votingPower < 100) {
      alert("Necesitas al menos 100 ASTR stakeados para crear una propuesta.");
      return;
    }
    alert("Funcionalidad de creación de propuestas próximamente...");
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
            {userStake.stakedAmount}
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-lg p-4 border border-green-400/30">
          <div className="text-green-200 text-sm mb-1">Poder de Voto</div>
          <div className="text-2xl font-bold text-white">
            {userStake.votingPower}
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-600/30 to-orange-600/30 rounded-lg p-4 border border-yellow-400/30">
          <div className="text-yellow-200 text-sm mb-1">Recompensas</div>
          <div className="text-2xl font-bold text-white">
            {userStake.rewards.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Staking Section */}
      <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          🔒 Stake ASTR para Votar
        </h3>

        <div className="flex gap-3 mb-4">
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            placeholder="Cantidad de ASTR"
            className="flex-1 bg-purple-800/30 text-white px-3 py-2 rounded-lg border border-purple-400/30 placeholder-purple-300"
            disabled={isStaking}
          />
          <button
            onClick={handleStake}
            disabled={isStaking || !stakeAmount}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            {isStaking ? "⏳ Procesando..." : "🔒 Stake"}
          </button>
        </div>

        <div className="text-purple-200 text-sm mb-4">
          💡 <strong>Ratio:</strong> 1 ASTR = 1 voto | <strong>APY:</strong> ~5%
          en recompensas
        </div>

        {userStake.stakedAmount > 0 && (
          <button
            onClick={handleUnstake}
            disabled={isStaking}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
          >
            {isStaking
              ? "⏳ Procesando..."
              : "🔓 Unstake Todo (7 días de espera)"}
          </button>
        )}
      </div>

      {/* Governance Actions */}
      <div className="space-y-3">
        <button
          onClick={handleCreateProposal}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          📝 Crear Nueva Propuesta
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/20">
            📊 Historial de Votos
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/20">
            🏆 Ranking DAO
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-800/30 rounded-lg border border-blue-400/30">
        <p className="text-blue-200 text-sm text-center">
          🌟 <strong>Próximamente:</strong> Delegación de votos y propuestas
          automáticas basadas en IA.
        </p>
      </div>
    </div>
  );
}
