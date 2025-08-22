"use client";

import { useState } from "react";

interface TreasuryData {
  totalBalance: number;
  allocatedFunds: number;
  availableFunds: number;
  totalProposals: number;
  fundedProposals: number;
}

interface FundedProject {
  id: number;
  title: string;
  category: string;
  amountFunded: number;
  status: "active" | "completed" | "in-progress";
  progress: number;
  beneficiary: string;
}

const mockTreasuryData: TreasuryData = {
  totalBalance: 15750,
  allocatedFunds: 8900,
  availableFunds: 6850,
  totalProposals: 12,
  fundedProposals: 7,
};

const mockFundedProjects: FundedProject[] = [
  {
    id: 1,
    title: "Comparsa Los Diablos del Carnaval",
    category: "Artistas",
    amountFunded: 2500,
    status: "in-progress",
    progress: 75,
    beneficiary: "Asociación Cultural Los Diablos",
  },
  {
    id: 2,
    title: "Escenario Principal del Parque",
    category: "Infraestructura",
    amountFunded: 4200,
    status: "active",
    progress: 30,
    beneficiary: "Municipalidad Local",
  },
  {
    id: 3,
    title: "Taller de Música Tradicional",
    category: "Educación",
    amountFunded: 1200,
    status: "completed",
    progress: 100,
    beneficiary: "Centro Cultural Comunitario",
  },
  {
    id: 4,
    title: "Festival de Arte Urbano",
    category: "Artistas",
    amountFunded: 1000,
    status: "completed",
    progress: 100,
    beneficiary: "Colectivo Arte Urbano",
  },
];

const statusColors = {
  active: "bg-blue-500/30 text-blue-200",
  "in-progress": "bg-yellow-500/30 text-yellow-200",
  completed: "bg-green-500/30 text-green-200",
};

const statusEmojis = {
  active: "🚀",
  "in-progress": "⏳",
  completed: "✅",
};

export function Treasury() {
  const [treasuryData] = useState<TreasuryData>(mockTreasuryData);
  const [fundedProjects] = useState<FundedProject[]>(mockFundedProjects);
  const [selectedProject, setSelectedProject] = useState<FundedProject | null>(
    null,
  );

  const handleWithdrawFunds = (projectId: number) => {
    const project = fundedProjects.find((p) => p.id === projectId);
    if (project) {
      alert(
        `Iniciando transferencia de ${project.amountFunded} ASTR a ${project.beneficiary}`,
      );
    }
  };

  const handleProposeTreasury = () => {
    alert("Funcionalidad de propuestas de tesorería próximamente...");
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        💰 Tesorería DAO
      </h2>

      {/* Treasury Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-600/30 to-emerald-600/30 rounded-lg p-3 border border-green-400/30">
          <div className="text-green-200 text-xs mb-1">Balance Total</div>
          <div className="text-lg font-bold text-white">
            {treasuryData.totalBalance.toLocaleString()}
          </div>
          <div className="text-green-300 text-xs">ASTR</div>
        </div>

        <div className="bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded-lg p-3 border border-blue-400/30">
          <div className="text-blue-200 text-xs mb-1">Fondos Asignados</div>
          <div className="text-lg font-bold text-white">
            {treasuryData.allocatedFunds.toLocaleString()}
          </div>
          <div className="text-blue-300 text-xs">ASTR</div>
        </div>

        <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-lg p-3 border border-purple-400/30">
          <div className="text-purple-200 text-xs mb-1">Disponible</div>
          <div className="text-lg font-bold text-white">
            {treasuryData.availableFunds.toLocaleString()}
          </div>
          <div className="text-purple-300 text-xs">ASTR</div>
        </div>

        <div className="bg-gradient-to-br from-orange-600/30 to-red-600/30 rounded-lg p-3 border border-orange-400/30">
          <div className="text-orange-200 text-xs mb-1">Proyectos</div>
          <div className="text-lg font-bold text-white">
            {treasuryData.fundedProposals}/{treasuryData.totalProposals}
          </div>
          <div className="text-orange-300 text-xs">Financiados</div>
        </div>
      </div>

      {/* Funded Projects */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          🎯 Proyectos Financiados
        </h3>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {fundedProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-purple-500/30 text-purple-200 px-2 py-1 rounded text-xs">
                      {project.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${statusColors[project.status]}`}
                    >
                      {statusEmojis[project.status]}{" "}
                      {project.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-white font-medium text-sm">
                    {project.title}
                  </h4>
                  <p className="text-purple-200 text-xs mt-1">
                    {project.beneficiary}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">
                    {project.amountFunded.toLocaleString()} ASTR
                  </div>
                  <div className="text-purple-300 text-xs">
                    {project.progress}% completado
                  </div>
                </div>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Treasury Actions */}
      <div className="space-y-3">
        <button
          onClick={handleProposeTreasury}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          💡 Proponer Uso de Fondos
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/20">
            📊 Historial de Gastos
          </button>
          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 border border-white/20">
            📈 Reportes Financieros
          </button>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-white/20">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">
                {selectedProject.title}
              </h3>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <span className="text-purple-300 text-sm">Beneficiario:</span>
                <p className="text-white">{selectedProject.beneficiary}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-purple-300">Categoría:</span>
                  <p className="text-white">{selectedProject.category}</p>
                </div>
                <div>
                  <span className="text-purple-300">Estado:</span>
                  <p className="text-white">{selectedProject.status}</p>
                </div>
                <div>
                  <span className="text-purple-300">Financiamiento:</span>
                  <p className="text-white">
                    {selectedProject.amountFunded.toLocaleString()} ASTR
                  </p>
                </div>
                <div>
                  <span className="text-purple-300">Progreso:</span>
                  <p className="text-white">{selectedProject.progress}%</p>
                </div>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${selectedProject.progress}%` }}
                ></div>
              </div>
            </div>

            {selectedProject.status !== "completed" && (
              <button
                onClick={() => handleWithdrawFunds(selectedProject.id)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                💸 Liberar Fondos
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-green-800/30 rounded-lg border border-green-400/30">
        <p className="text-green-200 text-sm text-center">
          🌱 <strong>Transparencia:</strong> Todos los movimientos de fondos son
          públicos y auditables en la blockchain.
        </p>
      </div>
    </div>
  );
}
