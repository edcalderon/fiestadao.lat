"use client";

import { useState } from "react";

interface NFTBadge {
  id: number;
  name: string;
  description: string;
  image: string;
  proposalTitle: string;
  voteType: "for" | "against";
  date: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  attributes: {
    event: string;
    category: string;
    votingPower: number;
  };
}

const mockNFTs: NFTBadge[] = [
  {
    id: 1,
    name: "Proof of Culture #001",
    description:
      "Certificado de participación en la votación para apoyar la Comparsa Los Diablos",
    image:
      "https://api.dicebear.com/7.x/shapes/svg?seed=culture001&backgroundColor=8b5cf6",
    proposalTitle: "Apoyar a la Comparsa Los Diablos del Carnaval",
    voteType: "for",
    date: "2024-01-15",
    rarity: "rare",
    attributes: {
      event: "Carnaval 2024",
      category: "Artistas",
      votingPower: 250,
    },
  },
  {
    id: 2,
    name: "Proof of Culture #002",
    description:
      "Certificado de participación en la votación del Escenario Principal",
    image:
      "https://api.dicebear.com/7.x/shapes/svg?seed=culture002&backgroundColor=10b981",
    proposalTitle: "Construcción del Escenario Principal",
    voteType: "for",
    date: "2024-01-20",
    rarity: "epic",
    attributes: {
      event: "Festival de Verano 2024",
      category: "Infraestructura",
      votingPower: 500,
    },
  },
  {
    id: 3,
    name: "Proof of Culture #003",
    description:
      "Certificado de participación en la votación del Taller de Música",
    image:
      "https://api.dicebear.com/7.x/shapes/svg?seed=culture003&backgroundColor=f59e0b",
    proposalTitle: "Taller de Música Tradicional para Jóvenes",
    voteType: "for",
    date: "2024-01-25",
    rarity: "common",
    attributes: {
      event: "Programa Educativo 2024",
      category: "Educación",
      votingPower: 100,
    },
  },
];

const rarityColors = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-purple-600",
  epic: "from-purple-400 to-pink-600",
  legendary: "from-yellow-400 to-orange-600",
};

const rarityEmojis = {
  common: "🥉",
  rare: "🥈",
  epic: "🥇",
  legendary: "👑",
};

export function NFTBadges() {
  const [nfts] = useState<NFTBadge[]>(mockNFTs);
  const [selectedNFT, setSelectedNFT] = useState<NFTBadge | null>(null);

  const handleMintNFT = () => {
    alert(
      "¡Vota en una propuesta activa para recibir tu próximo NFT Proof of Culture!",
    );
  };

  const handleShareNFT = (nft: NFTBadge) => {
    const shareText = `¡Acabo de recibir mi ${nft.name} por participar en FiestaDAO! 🎭✨ #ProofOfCulture #FiestaDAO #ASTR`;
    if (navigator.share) {
      navigator.share({
        title: nft.name,
        text: shareText,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert("¡Texto copiado al portapapeles!");
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🎨 Mis NFT Badges
        </h2>
        <div className="text-purple-200 text-sm">Total: {nfts.length} NFTs</div>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-80 overflow-y-auto">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer transform hover:scale-105"
            onClick={() => setSelectedNFT(nft)}
          >
            <div className="relative mb-3">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-32 object-cover rounded-lg"
              />
              <div
                className={`absolute top-2 right-2 bg-gradient-to-r ${rarityColors[nft.rarity]} px-2 py-1 rounded text-xs text-white font-bold flex items-center gap-1`}
              >
                {rarityEmojis[nft.rarity]} {nft.rarity.toUpperCase()}
              </div>
            </div>

            <h3 className="text-white font-semibold text-sm mb-2">
              {nft.name}
            </h3>
            <p className="text-purple-200 text-xs mb-2 line-clamp-2">
              {nft.description}
            </p>

            <div className="flex justify-between items-center text-xs">
              <span
                className={`px-2 py-1 rounded ${
                  nft.voteType === "for"
                    ? "bg-green-500/30 text-green-200"
                    : "bg-red-500/30 text-red-200"
                }`}
              >
                {nft.voteType === "for" ? "✅ A Favor" : "❌ En Contra"}
              </span>
              <span className="text-purple-300">{nft.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleMintNFT}
          className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
        >
          ✨ Mint Nuevo NFT
        </button>
        <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/20">
          🌐 Ver en OpenSea
        </button>
      </div>

      {/* NFT Details Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-white/20">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">
                {selectedNFT.name}
              </h3>
              <button
                onClick={() => setSelectedNFT(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            <img
              src={selectedNFT.image}
              alt={selectedNFT.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <div className="space-y-3 mb-6">
              <div>
                <span className="text-purple-300 text-sm">Propuesta:</span>
                <p className="text-white">{selectedNFT.proposalTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-purple-300">Evento:</span>
                  <p className="text-white">{selectedNFT.attributes.event}</p>
                </div>
                <div>
                  <span className="text-purple-300">Categoría:</span>
                  <p className="text-white">
                    {selectedNFT.attributes.category}
                  </p>
                </div>
                <div>
                  <span className="text-purple-300">Poder de Voto:</span>
                  <p className="text-white">
                    {selectedNFT.attributes.votingPower} ASTR
                  </p>
                </div>
                <div>
                  <span className="text-purple-300">Rareza:</span>
                  <p className="text-white">
                    {rarityEmojis[selectedNFT.rarity]} {selectedNFT.rarity}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleShareNFT(selectedNFT)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
            >
              📱 Compartir NFT
            </button>
          </div>
        </div>
      )}

      <div className="p-4 bg-pink-800/30 rounded-lg border border-pink-400/30">
        <p className="text-pink-200 text-sm text-center">
          🎭 <strong>Colecciona:</strong> Cada NFT es único y representa tu
          participación en la cultura local.
        </p>
      </div>
    </div>
  );
}
