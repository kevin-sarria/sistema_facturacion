import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { Store, KeyRound, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (emailInput: string, passInput: string) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.post('/login', {
        email: emailInput,
        password: passInput,
      });

      if (res.data?.success) {
        localStorage.setItem('pos_token', res.data.data.token);
        localStorage.setItem('pos_user', JSON.stringify(res.data.data.user));
        navigate('/dashboard/metricas');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  const handleQuickLogin = () => {
    setEmail('admin@papeleria.com');
    setPassword('admin123');
    handleLogin('admin@papeleria.com', 'admin123');
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="w-full bg-white p-7 sm:p-8 rounded-2xl border border-stone-200/90 shadow-[0_1px_3px_rgb(0_0_0/0.04)] space-y-5">
        <div className="text-center space-y-1.5">
          <div className="size-11 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-800">
            <Store className="size-5" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
            Papelería Universal
          </h1>
          <p className="text-xs text-stone-500">
            Acceso al sistema comercial y punto de venta
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Botón de Acceso Rápido para Demostración */}
        <button
          type="button"
          onClick={handleQuickLogin}
          disabled={loading}
          className="w-full py-2.5 px-3 bg-stone-50 hover:bg-stone-100 border border-stone-300/80 text-stone-700 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors active:scale-98"
        >
          <ShieldCheck className="size-4 text-emerald-600" />
          <span>Ingreso Demo (Cajero Principal)</span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-stone-200"></div>
          <span className="flex-shrink mx-3 text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
            O con tus datos
          </span>
          <div className="flex-grow border-t border-stone-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@papeleria.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                Contraseña
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-stone-500 hover:text-stone-800"
              >
                ¿Olvidaste?
              </Link>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs"
          >
            <span>{loading ? 'Verificando...' : 'Iniciar Sesión'}</span>
            <ArrowRight className="size-3.5 text-amber-400" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100">
          <p className="text-xs text-stone-500">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-stone-900 hover:underline">
              Registrar Negocio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
