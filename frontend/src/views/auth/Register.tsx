import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { Store, User, Mail, KeyRound, ArrowRight } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (password !== passwordConfirmation) {
      setErrorMsg('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.post('/register', {
        name,
        last_name: lastName,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (res.data?.success) {
        localStorage.setItem('pos_token', res.data.data.token);
        localStorage.setItem('pos_user', JSON.stringify(res.data.data.user));
        navigate('/dashboard/metricas');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Error al crear la cuenta. Intente de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="w-full bg-white p-7 sm:p-8 rounded-2xl border border-stone-200/90 shadow-[0_1px_3px_rgb(0_0_0/0.04)] space-y-5">
        <div className="text-center space-y-1.5">
          <div className="size-11 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-800">
            <Store className="size-5" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
            Crear Nueva Cuenta
          </h1>
          <p className="text-xs text-stone-500">
            Registra tu negocio y accede al mostrador
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                Nombre *
              </label>
              <input
                type="text"
                required
                placeholder="Juan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white text-stone-900 font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
                Apellido
              </label>
              <input
                type="text"
                placeholder="Pérez"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white text-stone-900 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              required
              placeholder="juan@papeleria.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white text-stone-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
              Contraseña *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white text-stone-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1">
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 focus:bg-white text-stone-900 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs mt-2"
          >
            <span>{loading ? 'Creando cuenta...' : 'Comenzar Ahora'}</span>
            <ArrowRight className="size-3.5 text-amber-400" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-stone-100">
          <p className="text-xs text-stone-500">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/" className="font-semibold text-stone-900 hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
