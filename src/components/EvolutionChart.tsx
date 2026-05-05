import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import type { LessonEntry } from '../data/types';

interface Props {
  lessonHistory: LessonEntry[];
}

export default function EvolutionChart({ lessonHistory }: Props) {
  const data = lessonHistory.map((entry) => ({
    date: new Date(entry.lessonDate).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }),
    nota: entry.grade,
  }));

  const avg =
    data.reduce((sum, d) => sum + d.nota, 0) / data.length;

  const latestGrade = data[data.length - 1]?.nota ?? 0;
  const previousGrade = data[data.length - 2]?.nota ?? 0;
  const trend = latestGrade - previousGrade;

  return (
    <div className="rounded-xl border border-red-500/20 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Histórico & Evolução
          </h3>
          <p className="mt-0.5 text-[10px] text-gray-600">Notas das últimas aulas</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-800 px-3 py-1">
            <span className="text-[10px] uppercase tracking-wider text-gray-500">Média</span>
            <span className="text-sm font-bold text-gray-300">{avg.toFixed(1)}</span>
          </div>
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 ${
              trend >= 0
                ? 'border border-emerald-500/20 bg-emerald-500/5'
                : 'border border-red-500/20 bg-red-500/5'
            }`}
          >
            <TrendingUp
              className={`h-3.5 w-3.5 ${
                trend >= 0 ? 'text-emerald-400' : 'text-red-400 rotate-180'
              }`}
            />
            <span
              className={`text-sm font-bold ${
                trend >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {trend >= 0 ? '+' : ''}
              {trend.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="gradeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={{ stroke: '#374151' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <ReferenceLine
              y={avg}
              stroke="#ef4444"
              strokeDasharray="6 4"
              strokeOpacity={0.4}
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
              formatter={(value: number) => [value.toFixed(1), 'Nota']}
              labelFormatter={(label) => `Aula: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="nota"
              stroke="#ef4444"
              strokeWidth={2.5}
              fill="url(#gradeGradient)"
              dot={{
                r: 4,
                fill: '#ef4444',
                stroke: '#111827',
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
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
