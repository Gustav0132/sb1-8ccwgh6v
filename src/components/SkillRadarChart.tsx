import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { StudentSkills } from '../data/types';

interface Props {
  skills: StudentSkills;
}

const skillLabels: Record<string, string> = {
  tuning: 'Afinação',
  instrumentPractice: 'Prática de Instrumento',
  rhythmicPerception: 'Percepção Rítmica',
  metricReading: 'Leitura Métrica',
};

export default function SkillRadarChart({ skills }: Props) {
  const data = [
    { skill: skillLabels.tuning, value: skills.tuning, fullMark: 100 },
    { skill: skillLabels.instrumentPractice, value: skills.instrumentPractice, fullMark: 100 },
    { skill: skillLabels.rhythmicPerception, value: skills.rhythmicPerception, fullMark: 100 },
    { skill: skillLabels.metricReading, value: skills.metricReading, fullMark: 100 },
  ];

  const avg = Math.round(
    (skills.tuning + skills.instrumentPractice + skills.rhythmicPerception + skills.metricReading) /
      4
  );

  return (
    <div className="rounded-xl border border-red-500/20 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Atributos de Habilidade
          </h3>
          <p className="mt-0.5 text-[10px] text-gray-600">Equilíbrio entre competências</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-3 py-1">
          <span className="text-[10px] uppercase tracking-wider text-gray-500">Média</span>
          <span className="text-lg font-bold text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]">
            {avg}
          </span>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid
              stroke="#374151"
              strokeOpacity={0.5}
              gridType="polygon"
            />
            <PolarAngleAxis
              dataKey="skill"
              tick={{
                fill: '#9ca3af',
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                boxShadow: '0 0 15px rgba(239,68,68,0.1)',
                color: '#f3f4f6',
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value}/100`, 'Nível']}
            />
            <Radar
              name="Habilidade"
              dataKey="value"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.15}
              strokeWidth={2}
              dot={{
                r: 4,
                fill: '#ef4444',
                stroke: '#1f2937',
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: '#ef4444',
                stroke: '#ef4444',
                strokeWidth: 2,
                filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.6))',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {data.map((item) => (
          <div
            key={item.skill}
            className="rounded-lg border border-gray-800 bg-gray-900/60 px-3 py-2 text-center"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
              {item.skill}
            </p>
            <p className="mt-0.5 text-lg font-bold text-red-400">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
