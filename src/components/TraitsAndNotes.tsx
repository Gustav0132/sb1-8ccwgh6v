import React from 'react';
import { AlertTriangle, Trophy, FileText } from 'lucide-react';

interface Props {
  traits: {
    traits?: string[]; // Mantido como opcional para não quebrar tipos antigos
    strengths: string;
    criticalDifficulties: string;
    theoreticalGrades?: string; // 🟢 Nossa nova informação vinda da API
  };
}

export default function TraitsAndNotes({ traits }: Props) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-800 bg-gray-900/50 p-6">
      {/* 🟢 Novo Título Principal */}
      <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-400">
        Feedback & Resultados
      </h3>

      <div className="space-y-4">
        {/* PONTOS DE ATENÇÃO */}
        <div className="rounded-lg border border-yellow-900/50 bg-yellow-900/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-yellow-500">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Pontos de Atenção</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            {traits.criticalDifficulties}
          </p>
        </div>

        {/* PONTOS FORTES */}
        <div className="rounded-lg border border-emerald-900/50 bg-emerald-900/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-500">
            <Trophy className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Pontos Fortes</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            {traits.strengths}
          </p>
        </div>

        {/* 🟢 AVALIAÇÕES TEÓRICAS */}
        {traits.theoreticalGrades && (
          <>
            {/* Divisória sutil */}
            <div className="my-2 h-px w-full bg-gray-800/50" />
            
            <div className="rounded-lg border border-blue-900/50 bg-blue-900/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-blue-400">
                <FileText className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Avaliações Teóricas</span>
              </div>
              <p className="text-sm font-medium leading-relaxed text-blue-100">
                {traits.theoreticalGrades}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}