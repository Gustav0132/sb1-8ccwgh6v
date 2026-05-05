import React from 'react';
import { Target, Music, BookOpen, Brain } from 'lucide-react';
import StudentProfile from './StudentProfile';
import SkillRadarChart from './SkillRadarChart';
import TraitsAndNotes from './TraitsAndNotes';
import EvolutionChart from './EvolutionChart';
import ComplementaryInfo from './ComplementaryInfo';
import type { StudentDashboard } from '../data/types';

interface Props {
  data: StudentDashboard;
}

export default function Dashboard({ data }: Props) {
  // Captura os desafios capturados pelo radar inteligente da API
  const challenges = (data as any).weeklyChallenges || {
    hinos: 'Nenhum marcado',
    metodo: 'Consultar instrutor',
    teoria: 'Revisar fase atual'
  };

  return (
    <div className="relative space-y-6">
      {/* 1. Perfil do Aluno (Cabeçalho) */}
      <section>
        <StudentProfile student={data.student} />
      </section>

      {/* 🟢 NOVO CAMPO: DESAFIOS DA SEMANA (FORA DAS INFOS COMPLEMENTARES) */}
      <section className="rounded-xl border border-red-500/30 bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-lg">
        <div className="mb-5 flex items-center gap-3">
          <Target className="h-5 w-5 text-red-500" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Desafios Da semana
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* HINOS PARA ESTUDO */}
          <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-red-400">
              <Music className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Hinos para Estudo</span>
            </div>
            <p className="text-sm font-medium text-gray-200">{challenges.hinos}</p>
          </div>

          {/* MÉTODO */}
          <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-blue-400">
              <BookOpen className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Método</span>
            </div>
            <p className="text-sm font-medium text-gray-200">{challenges.metodo}</p>
          </div>

          {/* TEORIA (MSA) */}
          <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-emerald-400">
              <Brain className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Teoria (MSA)</span>
            </div>
            <p className="text-sm font-medium text-gray-200">{challenges.teoria}</p>
          </div>
        </div>
      </section>

      {/* 2. Grid de Atributos e Notas */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <SkillRadarChart skills={data.skills} />
        </section>
        <section>
          <TraitsAndNotes traits={data.traits} />
        </section>
      </div>

      {/* 3. Informações Complementares */}
      <section>
        <ComplementaryInfo student={data.student} testEntries={data.testEntries} hymnsData={data.hymnsData} />
      </section>

      {/* 4. Gráfico de Evolução */}
      {data.lessonHistory.length > 0 && (
        <section>
          <EvolutionChart lessonHistory={data.lessonHistory} />
        </section>
      )}
    </div>
  );
}