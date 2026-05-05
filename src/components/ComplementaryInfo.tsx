import React from 'react';
import { Cross, ClipboardList, Calendar } from 'lucide-react';
import type { Student, TestEntry, HymnsData } from '../data/types';

interface Props {
  student: Student;
  testEntries: TestEntry[];
  hymnsData?: HymnsData;
}

export default function ComplementaryInfo({ student, testEntries, hymnsData }: Props) {
  const safeHymnsData = hymnsData || {
    jovens: { concluido: 0, total: 100, progresso: 0 },
    oficiais: { concluido: 0, total: 380, progresso: 0 },
    voices: 'Soprano e Contralto' // ← Padrão caso não venha nada da API
  };

  const progressoJovens   = safeHymnsData.jovens.progresso   ?? Math.min((safeHymnsData.jovens.concluido   / safeHymnsData.jovens.total)   * 100, 100);
  const progressoOficiais = safeHymnsData.oficiais.progresso ?? Math.min((safeHymnsData.oficiais.concluido / safeHymnsData.oficiais.total) * 100, 100);

  // 🟢 Funções de cor da barra
  const getBarColor = (progresso: number) => {
    return progresso >= 100 
      ? 'bg-gradient-to-r from-red-700 to-red-500' 
      : 'bg-gray-500';                             
  };

  const getTextColor = (progresso: number) => {
    return progresso >= 100 
      ? 'text-red-400' 
      : 'text-gray-300';
  };

  return (
    <div className="rounded-xl border border-red-500/20 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">
        Informações Complementares
      </h3>

      <div className="space-y-4">
        {/* BATIZADO */}
        <div className="flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-3">
          <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border ${student.baptized ? 'border-blue-500/30 bg-blue-500/10' : 'border-gray-700 bg-gray-800'}`}>
            <Cross className={`h-5 w-5 ${student.baptized ? 'text-blue-400' : 'text-gray-600'}`} />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Batizado</p>
            <p className={`text-sm font-semibold ${student.baptized ? 'text-blue-400' : 'text-gray-500'}`}>
              {student.baptized ? (student.baptismDate ? `Sim em ${student.baptismDate}` : 'Sim') : 'Não'}
            </p>
          </div>
        </div>

        {/* FREQUÊNCIA */}
        <div className="flex items-center gap-4 rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10">
            <Calendar className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Frequência</p>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {student.attendanceDetail || '44 aulas'}
              </span>
            </div>
            <p className="text-xl font-extrabold text-gray-100">{student.frequency || '0%'}</p>
          </div>
        </div>

        {/* PROGRESSO DE HINOS */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-4">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            
            {/* 🟢 TÍTULO DINÂMICO AQUI: Ele vai ler a variável da API! */}
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Hinos: {safeHymnsData.voices || 'Soprano e Contralto'}
            </span>

          </div>
          <div className="space-y-4">
            
            {/* JOVENS E MENORES */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-medium text-gray-400">Jovens e Menores</span>
                <span className={`text-[11px] font-bold ${getTextColor(progressoJovens)}`}>
                  {progressoJovens.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${getBarColor(progressoJovens)}`}
                  style={{ width: `${Math.min(progressoJovens, 100)}%` }}
                />
              </div>
            </div>

            {/* OFICIAIS */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-medium text-gray-400">Oficiais</span>
                <span className={`text-[11px] font-bold ${getTextColor(progressoOficiais)}`}>
                  {progressoOficiais.toFixed(1)}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-800 overflow-hidden border border-gray-700/30">
                <div
                  className={`h-full transition-all duration-1000 ${getBarColor(progressoOficiais)}`}
                  style={{ width: `${Math.min(progressoOficiais, 100)}%` }}
                />
              </div>
            </div>
            
          </div>
        </div>

        {/* TESTES */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/60 px-4 py-3">
          <div className="mb-3 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-amber-400" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Testes</span>
          </div>
          {testEntries.length > 0 ? (
            <ul className="space-y-2">
              {testEntries.map((entry) => (
                <li key={entry.id} className="flex items-start gap-2 rounded-md border border-amber-500/10 bg-amber-500/5 px-3 py-2">
                  <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                  <p className="text-sm text-amber-200/90">{entry.description} <span className="font-medium text-amber-400">em {new Date(entry.testDate).toLocaleDateString('pt-BR')}</span></p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Nenhum teste registrado</p>
          )}
        </div>
      </div>
    </div>
  );
}