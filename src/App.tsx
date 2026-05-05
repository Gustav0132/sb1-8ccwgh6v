import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import DashboardApp from './DashboardApp'; // 🟢 Atenção ao nome aqui!

function AppContent() {
  const { user } = useAuth();

  // Se o usuário não estiver logado, mostra a tela de Login
  if (!user) {
    return <Login />;
  }

  // Se estiver logado, mostra o conteúdo principal
  return <DashboardApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}