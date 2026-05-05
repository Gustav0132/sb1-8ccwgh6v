import React from 'react';
import { User, Music, Calendar, Church } from 'lucide-react';
import type { Student } from '../data/types';

interface Props {
  student: Student;
}

export default function StudentProfile({ student }: Props) {
  // Ajuste: A API agora envia 'student.level' como texto (ex: "Aprendiz") e 'student.xp' (de 0 a 100)
  const levelTitle = typeof student.level === 'string' ? student.level : 'Iniciante';
  
  // Garantimos que o XP seja um número válido entre 0 e 100 para não quebrar a barra
  const xpCurrent = typeof student.xp === 'number' && !isNaN(student.xp) ? student.xp : 0;
  const xpNeeded = 100;
  const xpPercent = Math.min((xpCurrent / xpNeeded) * 100, 100);

  return (
    <div className="relative overflow-hidden rounded-xl border border-red-500/20 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6">
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-red-500/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-red-500/5 blur-3xl" />

      <div className="relative flex items-start gap-5">
        <div className="relative flex-shrink-0">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-red-500/40 bg-gray-800 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            {student.avatarUrl ? (
              <img
                src={student.avatarUrl}
                alt={student.fullName}
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-red-400" />
            )}
          </div>
          {/* Removi o bolinha vermelha que tentava mostrar o número do level, pois agora o level é um texto */}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold tracking-wide text-white">
            {student.fullName}
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-widest text-red-400">
              {levelTitle}
            </span>
          </div>

          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-gray-400">XP</span>
              <span className="text-red-400">
                {xpCurrent} / {xpNeeded}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-700 to-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)] transition-all duration-700"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <InfoItem icon={<User className="h-4 w-4" />} label="Idade" value={`${student.age || '--'} anos`} />
        <InfoItem
          icon={<Music className="h-4 w-4" />}
          label="Instrumento"
          value={student.instrument}
        />
        <InfoItem
          icon={<Calendar className="h-4 w-4" />}
          label="Início"
          value={student.startDate ? new Date(student.startDate).toLocaleDateString('pt-BR') : '--/--/----'}
        />
        <InfoItem
          icon={<Church className="h-4 w-4" />}
          label="Comum"
          value={student.congregation || '—'}
        />
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/60 px-3 py-2.5">
      <div className="mb-1 flex items-center gap-1.5 text-gray-500">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold text-gray-200">{value}</p>
    </div>
  );
}