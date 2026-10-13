import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useHotkeys } from '../../hooks/useHotkeys';
import { Toaster } from '../../components/ui/toast';
import { ShortcutsDialog } from '../../components/ui/shortcuts-dialog';
import {
  Store,
  ShoppingCart,
  Package,
  BookOpen,
  Truck,
  Coins,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Clock,
  Keyboard,
} from 'lucide-react';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  statusDot?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const AdminTemplate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pos_sidebar_collapsed');
      if (saved !== null) {
        return saved === 'true';
      }
    } catch {
      // Si localStorage no está disponible
    }
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 && window.innerWidth < 1024;
    }
    return false;
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true
  );
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; last_name?: string; email?: string } | null>(null);
  const [isCashOpen, setIsCashOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return {
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }),
    };
  });

  // Guardar preferencia de colapso en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pos_sidebar_collapsed', String(isSidebarCollapsed));
    } catch {
      // Ignorar si localStorage falla
    }
  }, [isSidebarCollapsed]);

  // Manejo de visibilidad al animar el colapso del menú en escritorio
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 200);
    return () => clearTimeout(timer);
  }, [isSidebarCollapsed]);

  // El colapso del menú solo existe en escritorio; en móvil manda el drawer superpuesto
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const isSidebarHidden = isDesktop && isSidebarCollapsed;
  const isMenuVisible = isDesktop ? !isSidebarCollapsed : isSidebarOpen;

  const handleToggleSidebar = () => {
    if (isDesktop) {
      setIsSidebarCollapsed((prev) => !prev);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  // Atajos globales con prevención de acciones nativas del navegador (F1..F12)
  useHotkeys([
    { key: 'F1', handler: () => navigate('/dashboard/pos') },
    { key: 'F2', handler: () => navigate('/dashboard/inventario') },
    { key: 'F3', handler: () => navigate('/dashboard/creditos') },
    { key: 'F4', handler: () => navigate('/dashboard/caja') },
    { key: 'F6', handler: () => navigate('/dashboard/compras') },
    { key: 'F7', handler: () => navigate('/dashboard/metricas') },
    { key: 'F10', handler: handleToggleSidebar },
  ]);

  // 1. Cargar usuario de localStorage una sola vez al montar
  useEffect(() => {
    const savedUser = localStorage.getItem('pos_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser({ name: 'Cajero Principal' });
      }
    } else {
      setUser({ name: 'Cajero Principal' });
    }
  }, []);

  // 2. Refrescar estado de caja al navegar o cambiar de ruta (sin recrear el reloj)
  useEffect(() => {
    api.get('/cash-shift/current')
      .then((res) => {
        if (res.data?.success) {
          setIsCashOpen(res.data.is_open);
        }
      })
      .catch(() => {});
  }, [location.pathname]);

  // 3. Reloj del mostrador (intervalo persistente sin reinicios por navegación)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime({
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }),
      });
    };

    const timer = setInterval(updateTime, 15000);
    return () => clearInterval(timer);
  }, []);

  // 4. Accesibilidad móvil: cerrar sidebar con tecla Escape y bloquear scroll del body
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsSidebarOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isSidebarOpen]);

  // 5. Cerrar drawer cuando cambie la ruta (navegación por atajos, enlaces o historial)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('pos_token');
    localStorage.removeItem('pos_user');
    navigate('/');
  };

  const navSections: NavSection[] = [
    {
      title: 'Operación',
      items: [
        {
          to: '/dashboard/pos',
          label: 'Caja Mostrador',
          icon: ShoppingCart,
          shortcut: 'F1',
        },
        {
          to: '/dashboard/creditos',
          label: 'Cuaderno de Fiados',
          icon: BookOpen,
          shortcut: 'F3',
        },
        {
          to: '/dashboard/caja',
          label: 'Arqueo de Caja',
          icon: Coins,
          shortcut: 'F4',
          statusDot: isCashOpen ? 'bg-emerald-500' : 'bg-amber-400',
        },
      ],
    },
    {
      title: 'Administración',
      items: [
        {
          to: '/dashboard/inventario',
          label: 'Inventario & Costos',
          icon: Package,
          shortcut: 'F2',
        },
        {
          to: '/dashboard/compras',
          label: 'Proveedores & Facturas',
          icon: Truck,
          shortcut: 'F6',
        },
        {
          to: '/dashboard/metricas',
          label: 'Resumen General',
          icon: LayoutDashboard,
          shortcut: 'F7',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-800 flex font-sans antialiased selection:bg-stone-200">
      {/* Sistema de notificaciones toast */}
      <Toaster />

      {/* Diálogo de atajos de teclado */}
      <ShortcutsDialog
        open={isShortcutsOpen}
        onOpenChange={setIsShortcutsOpen}
      />

      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Lateral */}
      <aside
        id="sidebar"
        aria-label="Menú principal"
        aria-hidden={isSidebarHidden}
        {...(isSidebarHidden ? { inert: '' } : {})}
        onTransitionEnd={() => setIsTransitioning(false)}
        style={{
          visibility: isSidebarHidden && !isTransitioning ? 'hidden' : 'visible',
        }}
        className={`fixed md:sticky top-0 left-0 z-50 h-dvh shrink-0 bg-white border-r border-stone-200 flex flex-col justify-between overflow-hidden transition-[width,transform] duration-200 ease-in-out motion-reduce:transition-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${
          isSidebarCollapsed ? 'w-64 md:w-0 md:border-r-0' : 'w-64'
        }`}
      >
        <div className="w-64 h-full flex flex-col justify-between shrink-0">
          <div className="flex flex-col flex-1 overflow-y-auto">
            {/* Cabecera de la Marca */}
            <div className="h-16 px-5 border-b border-stone-100 flex items-center justify-between">
              <Link to="/dashboard/metricas" className="flex items-center gap-2.5 group">
                <div className="size-9 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-800 group-hover:bg-stone-200/70 transition-colors">
                  <Store className="size-5" />
                </div>
                <div className="leading-tight">
                  <span className="block text-sm font-bold text-stone-900 tracking-tight">
                    Papelería Universal
                  </span>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    Sistema Comercial
                  </span>
                </div>
              </Link>

              <button
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Cerrar menú lateral"
                className="min-w-11 min-h-11 flex items-center justify-center p-2 text-stone-400 hover:text-stone-700 rounded-lg md:hidden"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Menú de Navegación por Secciones */}
            <nav className="p-3 space-y-4">
              {navSections.map((sec) => (
                <div key={sec.title}>
                  <span className="block px-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    {sec.title}
                  </span>
                  <div className="space-y-1">
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsSidebarOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center justify-between px-3 min-h-11 rounded-xl text-xs font-medium transition-colors ${
                              isActive
                                ? 'bg-stone-100 text-stone-900 font-semibold border border-stone-200/80 shadow-2xs'
                                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                            }`
                          }
                        >
                            {({ isActive }) => (
                              <>
                                <div className="flex items-center gap-2.5">
                                  <Icon
                                    className={`size-4.5 ${
                                      isActive ? 'text-stone-900' : 'text-stone-400'
                                    }`}
                                  />
                                  <span className="text-xs font-semibold">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {item.shortcut && (
                                    <span className="hidden md:inline-block text-[11px] font-mono font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                                      {item.shortcut}
                                    </span>
                                  )}
                                  {item.statusDot && (
                                    <span className={`size-2.5 rounded-full ${item.statusDot}`} />
                                  )}
                                </div>
                              </>
                            )}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          {/* Pie de Barra Lateral: Botón Atajos, Usuario & Cierre de Sesión */}
          <div className="p-3 border-t border-stone-100 bg-stone-50/50 space-y-2">
            {/* Botón para abrir ayuda de atajos de teclado */}
            <button
              type="button"
              onClick={() => setIsShortcutsOpen(true)}
              className="w-full min-h-11 hidden md:flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-stone-700 hover:text-stone-950 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl transition-colors shadow-2xs"
            >
              <Keyboard className="size-4 text-stone-500" />
              <span>Atajos de teclado</span>
            </button>

            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-xs font-bold text-stone-700 shrink-0">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CP'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-stone-900 truncate leading-tight">
                    {user?.name || 'Cajero Principal'}
                  </p>
                  <p className="text-[11px] text-stone-400 truncate leading-tight">
                    {user?.email || 'admin@papeleria.com'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Cerrar Sesión"
                aria-label="Cerrar sesión"
                className="min-w-10 min-h-10 flex items-center justify-center p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 rounded-xl transition-colors"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Área Principal de Contenido */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra Superior del Mostrador */}
        <header className="h-16 bg-white border-b border-stone-200 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={handleToggleSidebar}
              aria-label={isMenuVisible ? 'Ocultar menú' : 'Mostrar menú'}
              title={isMenuVisible ? 'Ocultar menú' : 'Mostrar menú'}
              aria-expanded={isMenuVisible}
              aria-controls="sidebar"
              className="min-w-11 min-h-11 flex items-center justify-center p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <Menu className="size-5" />
            </button>
            <span className="text-xs font-medium text-stone-600 flex items-center gap-1.5 truncate">
              <Clock className="size-4 text-stone-400 shrink-0" />
              <span className="hidden sm:inline capitalize font-semibold">{currentTime.date} ·</span>
              <span className="font-bold tabular-nums">{currentTime.time}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Estado de Caja con touch target adecuado */}
            {isCashOpen ? (
              <Link
                to="/dashboard/caja"
                className="inline-flex items-center gap-2 px-3.5 min-h-11 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100/70 transition-colors"
              >
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="truncate">Caja Abierta</span>
              </Link>
            ) : (
              <Link
                to="/dashboard/caja"
                className="inline-flex items-center gap-2 px-3.5 min-h-11 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100/70 transition-colors"
              >
                <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                <span className="truncate">Caja Cerrada · Abrir</span>
              </Link>
            )}
          </div>
        </header>

        {/* Vista Inyectada */}
        <main className="@container p-3 sm:p-5 lg:p-6 pb-6 w-full max-w-screen-2xl mx-auto flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

