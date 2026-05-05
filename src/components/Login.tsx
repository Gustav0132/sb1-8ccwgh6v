import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Music2, Lock, Mail, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('E-mail ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-red-500/20 bg-gray-900 p-8 shadow-2xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <Music2 className="h-8 w-8 text-red-500" />
          </div>
          {/* Nome atualizado aqui embaixo */}
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-white uppercase">
            Ficha Técnica G.E.M
          </h2>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500">
            Rio Grande - RS
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="email"
                required
                className="w-full rounded-lg border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-4 text-white placeholder-gray-500 transition-colors focus:border-red-500 focus:outline-none"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                type="password"
                required
                className="w-full rounded-lg border border-gray-800 bg-gray-950 py-2.5 pl-10 pr-4 text-white placeholder-gray-500 transition-colors focus:border-red-500 focus:outline-none"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm font-medium text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-lg bg-red-600 py-3 text-sm font-bold text-white uppercase tracking-widest transition-all hover:bg-red-500 focus:outline-none disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}