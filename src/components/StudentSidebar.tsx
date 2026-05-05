import { useState, useMemo } from 'react';
import { Search, User, Loader2 } from 'lucide-react';

interface StudentListItem {
  name: string;
  sheetName: string;
}

interface Props {
  students: StudentListItem[];
  selected: string | null;
  onSelect: (sheetName: string) => void;
  loading: boolean;
}

export default function StudentSidebar({ students, selected, onSelect, loading }: Props) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return students;
    const q = search.toLowerCase();
    return students.filter((s) => s.name.toLowerCase().includes(q));
  }, [students, search]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-red-500/20 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="border-b border-gray-800 p-4">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-gray-400">
          Alunos
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar aluno..."
            className="w-full rounded-lg border border-gray-800 bg-gray-900/80 py-2 pl-9 pr-3 text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-gray-600">
            Nenhum aluno encontrado
          </p>
        ) : (
          <ul className="space-y-1">
            {filtered.map((student) => {
              const isActive = selected === student.sheetName;
              return (
                <li key={student.sheetName}>
                  <button
                    onClick={() => onSelect(student.sheetName)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                      isActive
                        ? 'border border-red-500/30 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                        : 'border border-transparent hover:border-gray-800 hover:bg-gray-900/60'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md ${
                        isActive
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      <User className="h-4 w-4" />
                    </div>
                    <span
                      className={`truncate text-sm font-medium ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {student.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="border-t border-gray-800 px-4 py-3">
        <p className="text-[10px] uppercase tracking-wider text-gray-600">
          {students.length} aluno{students.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
