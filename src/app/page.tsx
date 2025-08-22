"use client";

import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "./client";
import { Governance } from "@/components/Governance";
import { Proposals } from "@/components/Proposals";
import { NFTBadges } from "@/components/NFTBadges";
import { Treasury } from "@/components/Treasury";
import { AstarIntegration } from "@/components/AstarIntegration";

export default function Home() {
  const account = useActiveAccount();
  return (
    <main className="min-h-[100vh] bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <div className="flex justify-center mb-8">
          {!account ? (
            <ConnectButton
              client={client}
              appMetadata={{
                name: "FiestaDAO",
                url: "https://fiestadao.com",
              }}
            />
          ) : (
            <AstarIntegration />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Proposals />
          <Governance />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <NFTBadges />
          <Treasury />
        </div>
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="text-center mb-12">
      <div className="mb-6">
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
          Plataforma de gobernanza on-chain para la cultura local. Vota con ASTR
          en decisiones clave y recibe NFTs conmemorativos.
        </p>
      </div>
    </header>
  );
}
