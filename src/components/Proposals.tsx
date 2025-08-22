"use client";

import { useState } from "react";

interface Proposal {
  id: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  endDate: string;
  category: string;
  status: "active" | "ended" | "pending";
}

const mockProposals: Proposal[] = [
  {
    id: 1,
    title: "Apoyar a la Comparsa Los Diablos del Carnaval",
    description:
      "Financiar la participación de la comparsa tradicional Los Diablos en el próximo carnaval de la ciudad.",
    votesFor: 1250,
    votesAgainst: 340,
    endDate: "2024-02-15",
    category: "Artistas",
    status: "active",
  },
  {
    id: 2,
    title: "Construcción del Escenario Principal",
    description:
      "Construir un escenario principal permanente en el parque central para eventos culturales.",
    votesFor: 890,
    votesAgainst: 210,
    endDate: "2024-02-20",
    category: "Infraestructura",
    status: "active",
  },
  {
    id: 3,
    title: "Taller de Música Tradicional para Jóvenes",
    description:
      "Crear un programa educativo de música tradicional dirigido a jóvenes de la comunidad.",
    votesFor: 567,
    votesAgainst: 123,
    endDate: "2024-02-25",
    category: "Educación",
    status: "active",
  },
];

export function Proposals() {
  const [proposals] = useState<Proposal[]>(mockProposals);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "Artistas", "Infraestructura", "Educación"];

  const filteredProposals =
    selectedCategory === "all"
      ? proposals
      : proposals.filter((p) => p.category === selectedCategory);

  const handleVote = (proposalId: number, voteType: "for" | "against") => {
    // This would integrate with the smart contract
    console.log(`Voting ${voteType} on proposal ${proposalId}`);
    alert(`¡Voto registrado! Recibirás tu NFT Proof of Culture en breve.`);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🗳️ Propuestas Activas
        </h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-purple-800/50 text-white px-3 py-1 rounded-lg border border-purple-400/30"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "Todas" : cat}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredProposals.map((proposal) => {
          const totalVotes = proposal.votesFor + proposal.votesAgainst;
          const forPercentage =
            totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;

          return (
            <div
              key={proposal.id}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-500/30 text-purple-200 px-2 py-1 rounded text-xs">
                      {proposal.category}
                    </span>
                    <span className="text-green-400 text-xs">
                      ⏰ Termina: {proposal.endDate}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">
                    {proposal.title}
                  </h3>
                  <p className="text-purple-200 text-sm mb-3">
                    {proposal.description}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm text-purple-200 mb-1">
                  <span>A favor: {proposal.votesFor} ASTR</span>
                  <span>En contra: {proposal.votesAgainst} ASTR</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${forPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleVote(proposal.id, "for")}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  ✅ Votar A Favor
                </button>
                <button
                  onClick={() => handleVote(proposal.id, "against")}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                >
                  ❌ Votar En Contra
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-purple-800/30 rounded-lg border border-purple-400/30">
        <p className="text-purple-200 text-sm text-center">
          💡 <strong>Recuerda:</strong> Cada voto genera un NFT Proof of Culture
          único que certifica tu participación.
        </p>
      </div>
    </div>
  );
}
