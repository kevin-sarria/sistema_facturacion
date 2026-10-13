import { Outlet, useLocation } from "react-router-dom";
import { useTemplateImage } from "./hooks";

export const AuthTemplate = () => {
  const { pathname } = useLocation();
  const { image } = useTemplateImage({ pathname });

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#faf8f5]">
      {/* Columna Izquierda: Imagen y Marca Inspirada en Papelería y Comercio */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-stone-900 relative overflow-hidden items-center justify-center p-12 select-none">
        <img
          src={image || "/img/login-image.jpg"}
          alt="Papelería Universal"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity filter blur-[0.5px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-stone-900/40" />

        <div className="relative z-10 max-w-lg text-white space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wider uppercase">
            🏪 Punto de Venta & Inventario
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black font-serif tracking-tight leading-tight text-amber-50">
            Papelería Universal
          </h1>
          
          <p className="text-stone-300 text-base leading-relaxed font-sans">
            Diseñado para la velocidad del mostrador de barrio: lectura ultra-rápida de código de barras, 
            control de caja al centavo, cuaderno de fiados y catálogo para más de 10,000 productos.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-stone-800/80">
            <div className="bg-stone-800/50 p-4 rounded-2xl border border-stone-700/50 backdrop-blur-sm">
              <p className="text-2xl font-black text-amber-400">10,000+</p>
              <p className="text-xs text-stone-400 font-medium">Artículos y Útiles Escolares</p>
            </div>
            <div className="bg-stone-800/50 p-4 rounded-2xl border border-stone-700/50 backdrop-blur-sm">
              <p className="text-2xl font-black text-emerald-400">1 Clic</p>
              <p className="text-xs text-stone-400 font-medium">Arqueo y Cierre de Caja</p>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Formulario Limpio */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
