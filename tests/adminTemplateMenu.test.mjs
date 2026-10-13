import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('AdminTemplate & Sales - Drawer como menú único y barra de cobro móvil', () => {
  const adminTemplatePath = path.resolve(
    process.cwd(),
    'frontend/src/views/templates/AdminTemplate.tsx'
  );
  const adminTemplateContent = fs.readFileSync(adminTemplatePath, 'utf-8');

  const salesPath = path.resolve(
    process.cwd(),
    'frontend/src/views/sales/Sales.tsx'
  );
  const salesContent = fs.readFileSync(salesPath, 'utf-8');

  it('debe existir el botón hamburguesa en el header con aria-label dinámico y aria-expanded', () => {
    const headerRegex = /<header[\s\S]*?<\/header>/;
    const headerMatch = adminTemplateContent.match(headerRegex);
    assert.ok(headerMatch, 'Header debe existir en la plantilla');
    const headerContent = headerMatch[0];

    // Verificar que existe el botón hamburguesa con aria-label dinámico y aria-controls="sidebar"
    assert.match(
      headerContent,
      /aria-label=\{isMenuVisible \? 'Ocultar menú' : 'Mostrar menú'\}/,
      'Debe contener botón con aria-label dinámico "Ocultar menú" / "Mostrar menú"'
    );
    assert.match(
      headerContent,
      /aria-expanded=\{isMenuVisible\}/,
      'El botón debe tener aria-expanded={isMenuVisible}'
    );
    assert.match(
      headerContent,
      /aria-controls="sidebar"/,
      'El botón debe tener aria-controls="sidebar"'
    );
    assert.match(
      headerContent,
      /onClick=\{handleToggleSidebar\}/,
      'El botón debe alternar el sidebar al hacer click mediante handleToggleSidebar'
    );
    assert.match(
      headerContent,
      /<Menu\b/,
      'El botón debe renderizar el icono Menu'
    );
    assert.match(
      headerContent,
      /min-w-11 min-h-11/,
      'El botón debe cumplir el touch target mínimo min-w-11 min-h-11'
    );
    assert.doesNotMatch(
      headerContent,
      /\bmd:hidden\b/,
      'El botón NO debe estar oculto en desktop (no debe tener md:hidden)'
    );

    // Debe estar colocado a la izquierda del reloj con contenedor con gap-2 sm:gap-3
    assert.match(
      headerContent,
      /<div className="flex items-center gap-2 sm:gap-3 min-w-0">\s*<button[\s\S]*?<\/button>\s*<span className="text-xs font-medium text-stone-600 flex items-center gap-1.5 truncate">\s*<Clock/,
      'El botón hamburguesa debe estar a la izquierda del reloj en un contenedor con gap-2 sm:gap-3'
    );
  });

  it('debe importar Menu de lucide-react y NO importar Ellipsis', () => {
    const lucideImportRegex = /import\s*\{([\s\S]*?)\}\s*from\s*['"]lucide-react['"]/;
    const importMatch = adminTemplateContent.match(lucideImportRegex);
    assert.ok(importMatch, 'Debe importar iconos de lucide-react');
    const importedIcons = importMatch[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    assert.ok(
      importedIcons.includes('Menu'),
      'Menu debe estar importado para el botón hamburguesa'
    );
    assert.ok(
      !importedIcons.includes('Ellipsis'),
      'Ellipsis NO debe estar importado al haber eliminado la barra inferior'
    );
  });

  it('NO debe existir navegación fija inferior ni "Navegación rápida de mostrador" ni botón "Más"', () => {
    assert.doesNotMatch(
      adminTemplateContent,
      /Navegación rápida de mostrador/,
      'NO debe existir el aria-label o texto de la barra inferior'
    );
    assert.doesNotMatch(
      adminTemplateContent,
      /<nav[^>]*fixed bottom-0 inset-x-0/,
      'NO debe existir etiqueta nav con fixed bottom-0 inset-x-0'
    );
    assert.doesNotMatch(
      adminTemplateContent,
      /aria-label="Más opciones"/,
      'NO debe existir el botón "Más opciones"'
    );
    assert.doesNotMatch(
      adminTemplateContent,
      /<span>Más<\/span>/,
      'NO debe existir la etiqueta <span>Más</span>'
    );
  });

  it('NO deben existir inBottomBar, isMoreActive ni allItemsInBottomBar', () => {
    assert.doesNotMatch(
      adminTemplateContent,
      /\binBottomBar\b/,
      'inBottomBar no debe existir en el código ni en las interfaces'
    );
    assert.doesNotMatch(
      adminTemplateContent,
      /\bisMoreActive\b/,
      'isMoreActive no debe existir'
    );
    assert.doesNotMatch(
      adminTemplateContent,
      /\ballItemsInBottomBar\b/,
      'allItemsInBottomBar no debe existir'
    );
    assert.doesNotMatch(
      adminTemplateContent,
      /\bMORE_ROUTES\b/,
      'MORE_ROUTES no debe existir'
    );
  });

  it('las 6 rutas deben seguir presentes en navSections', () => {
    const expectedRoutes = [
      '/dashboard/pos',
      '/dashboard/creditos',
      '/dashboard/caja',
      '/dashboard/inventario',
      '/dashboard/compras',
      '/dashboard/metricas',
    ];

    for (const route of expectedRoutes) {
      assert.ok(
        adminTemplateContent.includes(`to: '${route}'`),
        `La ruta ${route} debe estar definida en navSections`
      );
    }
  });

  it('el drawer debe mostrar todos los items sin clases de ocultamiento condicional móvil', () => {
    // Los NavLink dentro del drawer no deben tener md:flex hidden
    assert.doesNotMatch(
      adminTemplateContent,
      /md:flex hidden/,
      'Los items del drawer no deben tener md:flex hidden'
    );
    assert.doesNotMatch(
      adminTemplateContent,
      /hidden md:block/,
      'Las secciones del drawer no deben tener hidden md:block'
    );
  });

  it('el botón "Atajos de teclado" debe seguir oculto en móvil (hidden md:flex)', () => {
    const shortcutsButtonRegex = /<button[\s\S]*?Atajos de teclado[\s\S]*?<\/button>/;
    const shortcutsMatch = adminTemplateContent.match(shortcutsButtonRegex);
    assert.ok(shortcutsMatch, 'Botón de atajos de teclado debe existir');
    const buttonContent = shortcutsMatch[0];

    assert.match(
      buttonContent,
      /hidden md:flex/,
      'El botón de atajos de teclado debe tener la clase hidden md:flex'
    );
  });

  it('main debe tener pb-6 y no pb-24 md:pb-6', () => {
    assert.match(
      adminTemplateContent,
      /<main className="[^"]*\bpb-6\b[^"]*"/,
      'main debe tener pb-6'
    );
    assert.doesNotMatch(
      adminTemplateContent,
      /pb-24/,
      'main no debe tener pb-24'
    );
  });

  it('debe mantener cierre por pathname, Escape, bloqueo de body scroll y atajos F1-F7', () => {
    // Cierre por cambio de ruta
    const pathnameEffectRegex = /useEffect\(\(\)\s*=>\s*\{[\s\S]*?setIsSidebarOpen\(false\);[\s\S]*?\}\s*,\s*\[location\.pathname\]\);/;
    assert.match(
      adminTemplateContent,
      pathnameEffectRegex,
      'Debe cerrar el drawer al cambiar location.pathname'
    );

    // Escape y bloqueo de body scroll
    assert.match(adminTemplateContent, /e\.key === 'Escape'/);
    assert.match(adminTemplateContent, /document\.body\.style\.overflow = 'hidden'/);

    // Overlay móvil
    assert.match(adminTemplateContent, /backdrop-blur-xs z-40 md:hidden/);

    // Aside id="sidebar" y altura h-dvh
    assert.match(adminTemplateContent, /id="sidebar"/, 'El aside debe tener id="sidebar"');
    assert.match(adminTemplateContent, /h-dvh/, 'El aside debe tener la clase h-dvh');

    // Atajos de teclado F1..F7
    assert.match(adminTemplateContent, /useHotkeys/);
    assert.match(adminTemplateContent, /key: 'F1'/);
    assert.match(adminTemplateContent, /key: 'F2'/);
    assert.match(adminTemplateContent, /key: 'F3'/);
    assert.match(adminTemplateContent, /key: 'F4'/);
    assert.match(adminTemplateContent, /key: 'F6'/);
    assert.match(adminTemplateContent, /key: 'F7'/);

    // Componentes globales
    assert.match(adminTemplateContent, /<Toaster \/>/);
    assert.match(adminTemplateContent, /<ShortcutsDialog/);
  });

  it('en Sales.tsx la barra fija de cobro móvil debe usar bottom-0 y no bottom-16', () => {
    assert.doesNotMatch(
      salesContent,
      /bottom-16/,
      'Sales.tsx no debe tener la clase bottom-16'
    );
    assert.match(
      salesContent,
      /fixed bottom-0 inset-x-0/,
      'Sales.tsx debe tener la barra fija de cobro en bottom-0'
    );
    assert.match(
      salesContent,
      /pb-\[max\(0\.75rem,env\(safe-area-inset-bottom\)\)\]/,
      'Sales.tsx debe incluir safe-area-inset-bottom para el padding inferior'
    );
    assert.match(
      salesContent,
      /isStacked/,
      'Sales.tsx debe controlar la barra fija según si el layout está en columna (isStacked)'
    );
  });
});
