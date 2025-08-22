import { Governance } from "@/components/Governance";
import { Proposals } from "@/components/Proposals";
import { NFTBadges } from "@/components/NFTBadges";
import { Treasury } from "@/components/Treasury";
import { AstarIntegration } from "@/components/AstarIntegration";

export default function FiestaDAOStoryboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            🎭{" "}
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              FiestaDAO
            </span>
          </h1>
          <p className="text-xl text-purple-200 mb-2">
            Cultura en tus manos con Astar
          </p>
          <p className="text-purple-300 max-w-2xl mx-auto">
            Plataforma de gobernanza on-chain para la cultura local. Vota con
            ASTR en decisiones clave y recibe NFTs conmemorativos.
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <Proposals />
          </div>
          <div className="xl:col-span-1">
            <Governance />
          </div>
          <div className="xl:col-span-1">
            <AstarIntegration />
          </div>
          <div className="xl:col-span-1">
            <NFTBadges />
          </div>
          <div className="xl:col-span-2">
            <Treasury />
          </div>
        </div>
      </div>
    </div>
  );
}
