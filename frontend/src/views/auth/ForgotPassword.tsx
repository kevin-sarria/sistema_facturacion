import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simular o enviar solicitud de recuperación
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-stone-200/80 shadow-xl shadow-stone-200/40 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight font-serif">
            Recuperar Contraseña
          </h1>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Ingresa tu correo institucional y te enviaremos las instrucciones para restablecer tu acceso.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-emerald-900 text-sm">¡Correo de recuperación enviado!</h3>
            <p className="text-xs text-emerald-700">
              Si existe una cuenta asociada a <strong>{email}</strong>, recibirás un enlace en los próximos minutos.
            </p>
            <div className="pt-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
              >
                <ArrowLeft className="w-4 h-4" /> Volver al Inicio de Sesión
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@papeleria.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-stone-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-stone-900/10 transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
            >
              {loading ? (
                <span>Enviando enlace...</span>
              ) : (
                <>
                  <Send className="h-4 w-4 text-amber-400" />
                  <span>Enviar Instrucciones</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-2 text-center border-t border-stone-100">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            ¿Recordaste tu contraseña? Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
};
