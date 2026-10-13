export interface ShortcutItem {
  key: string;
  label: string;
  description: string;
  scope: 'global' | 'pos';
  path?: string;
}

export const SHORTCUTS: ShortcutItem[] = [
  {
    key: 'F1',
    label: 'Caja Mostrador',
    description: 'Ir a la pantalla de cobro y punto de venta',
    scope: 'global',
    path: '/dashboard/pos',
  },
  {
    key: 'F2',
    label: 'Inventario & Costos',
    description: 'Catálogo de artículos, existencias y precios',
    scope: 'global',
    path: '/dashboard/inventario',
  },
  {
    key: 'F3',
    label: 'Cuaderno de Fiados',
    description: 'Créditos pendientes y abonos de clientes',
    scope: 'global',
    path: '/dashboard/creditos',
  },
  {
    key: 'F4',
    label: 'Arqueo de Caja',
    description: 'Apertura, cierre y cuadre de dinero en efectivo',
    scope: 'global',
    path: '/dashboard/caja',
  },
  {
    key: 'F6',
    label: 'Proveedores & Facturas',
    description: 'Facturas de compra y cuentas por pagar',
    scope: 'global',
    path: '/dashboard/compras',
  },
  {
    key: 'F7',
    label: 'Resumen General',
    description: 'Métricas operativas del día y ventas',
    scope: 'global',
    path: '/dashboard/metricas',
  },
  {
    key: 'F8',
    label: 'Buscar Producto',
    description: 'Enfoca el lector de código de barras o buscador',
    scope: 'pos',
  },
  {
    key: 'F9',
    label: 'Cobrar Venta',
    description: 'Abre el diálogo de cobro cuando hay productos',
    scope: 'pos',
  },
  {
    key: 'F10',
    label: 'Alternar Menú',
    description: 'Muestra u oculta la barra lateral de navegación',
    scope: 'global',
  },
];

export const getShortcutByKey = (key: string): ShortcutItem | undefined => {
  return SHORTCUTS.find((s) => s.key.toUpperCase() === key.toUpperCase());
};

export const getShortcutByPath = (path: string): ShortcutItem | undefined => {
  return SHORTCUTS.find((s) => s.path === path);
};
