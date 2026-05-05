import { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import StudentSidebar from './components/StudentSidebar';
import { fetchStudentList, fetchStudentDashboard } from './data/api';
import { useAuth } from './contexts/AuthContext';
import { auth } from './lib/firebase';
import { ScrollText, Loader2, AlertCircle, LogOut } from 'lucide-react';
import type { StudentDashboard } from './data/types';

interface StudentListItem {
  name: string;
  sheetName: string;
}

export default function DashboardApp() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<StudentDashboard | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Carrega a lista e filtra o aluno pelo e-mail logado
  useEffect(() => {
    fetchStudentList()
      .then((list) => {
        setStudents(list);
        if (user?.email) {
          // Pega o prefixo do e-mail (ex: 'arthur') e busca na planilha
          const userPrefix = user.email.split('@')[0].toLowerCase();
          const studentMatch = list.find(s => 
            s.sheetName.toLowerCase().replace(/\s/g, '').includes(userPrefix)
          );
          if (studentMatch) {
            setSelected(studentMatch.sheetName);
          } else if (list.length > 0) {
            setSelected(list[0].sheetName);
          }
        }
      })
      .catch((err) => {
        console.error('Failed to fetch student list:', err);
        setError('Erro ao carregar lista de alunos');
      })
      .finally(() => setLoadingList(false));
  }, [user]);

  const loadStudent = useCallback(async (sheetName: string) => {
    setLoadingDashboard(true);
    setError(null);
    try {
      const data = await fetchStudentDashboard(sheetName);
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to fetch student data:', err);
      setError('Erro ao carregar dados do aluno');
      setDashboardData(null);
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  useEffect(() => {
    if (selected) {
      loadStudent(selected);
    }
  }, [selected, loadStudent]);

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar visível apenas para você (Administrador) */}
      {user?.email === 'soaresgustavo622@gmail.com' && sidebarOpen && (
        <aside className="w-64 flex-shrink-0 border-r border-gray-800/50 transition-all duration-300">
          <StudentSidebar
            students={students}
            selected={selected}
            onSelect={setSelected}
            loading={loadingList}
          />
        </aside>
      )}

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="relative mb-8 flex items-center gap-3">
            {/* Botão de menu visível apenas para o ADM */}
            {user?.email === 'soaresgustavo622@gmail.com' && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 transition-colors hover:bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
              >
                <ScrollText className="h-5 w-5 text-red-400" />
              </button>
            )}
            
            {/* Título Atualizado */}
            <div>
              <h1 className="text-lg font-bold uppercase tracking-widest text-white">
                Ficha Técnica GEM
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500">
                Rio Grande - RS
              </p>
            </div>
            
            {/* Botão Sair */}
            <button 
              onClick={() => auth.signOut()}
              className="ml-auto flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </header>

          {/* Área de Alertas e Erros */}
          {error && !loadingDashboard && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Conteúdo Principal */}
          {loadingDashboard ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-red-400" />
              <p className="mt-4 text-sm text-gray-500 uppercase tracking-widest">Sincronizando dados...</p>
            </div>
          ) : dashboardData ? (
            <Dashboard data={dashboardData} />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500">
              <p className="text-sm uppercase tracking-widest">Aguardando seleção de perfil...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}