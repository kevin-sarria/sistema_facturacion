import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('AdminTemplate - Menú colapsable en escritorio y Container Queries', () => {
  const adminTemplatePath = path.resolve(
    process.cwd(),
    'frontend/src/views/templates/AdminTemplate.tsx'
  );
  const adminTemplateContent = fs.readFileSync(adminTemplatePath, 'utf-8');

  const shortcutsPath = path.resolve(
    process.cwd(),
    'frontend/src/lib/shortcuts.ts'
  );
  const shortcutsContent = fs.readFileSync(shortcutsPath, 'utf-8');

  const purchaseTablePath = path.resolve(
    process.cwd(),
    'frontend/src/views/purchases/components/PurchaseInvoicesTable.tsx'
  );
  const purchaseTableContent = fs.readFileSync(purchaseTablePath, 'utf-8');

  const dashboardPath = path.resolve(
    process.cwd(),
    'frontend/src/views/dashboard/Dashboard.tsx'
  );
  const dashboardContent = fs.readFileSync(dashboardPath, 'utf-8');

  const salesPath = path.resolve(
    process.cwd(),
    'frontend/src/views/sales/Sales.tsx'
  );
  const salesContent = fs.readFileSync(salesPath, 'utf-8');

  it('el botón hamburguesa vive siempre en el header sin la clase md:hidden', () => {
    const headerRegex = /<header[\s\S]*?<\/header>/;
    const headerMatch = adminTemplateContent.match(headerRegex);
    assert.ok(headerMatch, 'Header debe existir en AdminTemplate');
    const headerContent = headerMatch[0];

    // Verificar botón hamburguesa
    assert.match(headerContent, /<Menu\b/, 'El botón del header debe contener el icono Menu');
    assert.match(headerContent, /onClick=\{handleToggleSidebar\}/, 'El botón debe llamar a handleToggleSidebar');
    assert.doesNotMatch(headerContent, /\bmd:hidden\b/, 'El botón hamburguesa no debe tener md:hidden');
  });

  it('debe gestionar isSidebarCollapsed con clave pos_sidebar_collapsed y bloque try/catch', () => {
    assert.match(
      adminTemplateContent,
      /isSidebarCollapsed/,
      'Debe existir el estado isSidebarCollapsed'
    );
    assert.match(
      adminTemplateContent,
      /localStorage\.getItem\(['"]pos_sidebar_collapsed['"]\)/,
      'Debe leer pos_sidebar_collapsed de localStorage'
    );
    assert.match(
      adminTemplateContent,
      /localStorage\.setItem\(['"]pos_sidebar_collapsed['"]/,
      'Debe guardar pos_sidebar_collapsed en localStorage'
    );

    // Envolver en try/catch
    const tryCatchRegex = /try\s*\{[\s\S]*?pos_sidebar_collapsed[\s\S]*?\}\s*catch/;
    assert.match(
      adminTemplateContent,
      tryCatchRegex,
      'El acceso a localStorage pos_sidebar_collapsed debe estar envuelto en try/catch'
    );
  });

  it('el aside debe tener id="sidebar" y el botón del header debe tener aria-controls="sidebar"', () => {
    assert.match(
      adminTemplateContent,
      /<aside[^>]*id="sidebar"/,
      'El elemento <aside> debe tener el id="sidebar"'
    );
    assert.match(
      adminTemplateContent,
      /aria-controls="sidebar"/,
      'El botón del header debe tener aria-controls="sidebar"'
    );
    assert.match(
      adminTemplateContent,
      /aria-expanded=\{isMenuVisible\}/,
      'El botón del header debe tener aria-expanded={isMenuVisible}'
    );
  });

  it('el aside debe tener clases md:w-0 e inert al colapsar en escritorio', () => {
    assert.match(
      adminTemplateContent,
      /md:w-0/,
      'El aside debe soportar ancho 0 en escritorio (md:w-0)'
    );
    assert.match(
      adminTemplateContent,
      /inert/,
      'El aside debe recibir el atributo inert cuando está colapsado/oculto'
    );
    assert.match(
      adminTemplateContent,
      /aria-hidden=\{isSidebarHidden\}/,
      'El aside debe tener aria-hidden={isSidebarHidden}'
    );
  });

  it('debe utilizar isDesktop y matchMedia para diferenciar comportamiento móvil y escritorio', () => {
    assert.match(
      adminTemplateContent,
      /matchMedia\(['"]\(min-width:\s*768px\)['"]\)/,
      'Debe utilizar window.matchMedia con el umbral de 768px (md)'
    );
    assert.match(
      adminTemplateContent,
      /\bisDesktop\b/,
      'Debe manejar la variable o estado isDesktop'
    );
  });

  it('el contenedor <main> debe tener la clase @container para container queries', () => {
    assert.match(
      adminTemplateContent,
      /<main className="[^"]*@container[^"]*"/,
      'El elemento <main> debe contener la clase @container'
    );
  });

  it('el atajo F10 debe estar definido en shortcuts.ts y registrado en useHotkeys de AdminTemplate', () => {
    // shortcuts.ts
    assert.match(
      shortcutsContent,
      /key:\s*['"]F10['"]/,
      'F10 debe estar definido en shortcuts.ts'
    );
    assert.match(
      shortcutsContent,
      /label:\s*['"]Alternar Menú['"]/,
      'F10 debe tener la etiqueta "Alternar Menú"'
    );
    assert.match(
      shortcutsContent,
      /scope:\s*['"]global['"]/,
      'F10 debe tener scope "global"'
    );

    // AdminTemplate.tsx
    assert.match(
      adminTemplateContent,
      /key:\s*['"]F10['"],\s*handler:\s*handleToggleSidebar/,
      'AdminTemplate debe registrar F10 con handleToggleSidebar en useHotkeys'
    );
  });

  it('PurchaseInvoicesTable.tsx debe utilizar container queries (@4xl:) para alternar tabla y tarjetas', () => {
    assert.match(
      purchaseTableContent,
      /@4xl:hidden/,
      'Las tarjetas de facturas deben usar @4xl:hidden'
    );
    assert.match(
      purchaseTableContent,
      /hidden\s+@4xl:block/,
      'La tabla de facturas debe usar hidden @4xl:block'
    );
    assert.doesNotMatch(
      purchaseTableContent,
      /\bmd:hidden\b/,
      'PurchaseInvoicesTable.tsx no debe usar md:hidden'
    );
    assert.doesNotMatch(
      purchaseTableContent,
      /hidden\s+md:block/,
      'PurchaseInvoicesTable.tsx no debe usar hidden md:block'
    );
  });

  it('Dashboard.tsx debe utilizar container queries (@3xl:) para la tabla de operaciones recientes', () => {
    assert.match(
      dashboardContent,
      /@3xl:hidden/,
      'Las operaciones recientes deben usar @3xl:hidden para tarjetas'
    );
    assert.match(
      dashboardContent,
      /hidden\s+@3xl:block/,
      'Las operaciones recientes deben usar hidden @3xl:block para tabla'
    );
  });

  it('Sales.tsx debe usar @container, @4xl:flex-row, @4xl:w-96 y control de barra fija por isStacked', () => {
    assert.match(
      salesContent,
      /@container/,
      'Sales.tsx debe tener @container en su contenedor principal'
    );
    assert.match(
      salesContent,
      /@4xl:flex-row/,
      'Sales.tsx debe usar @4xl:flex-row para cambiar a disposición horizontal'
    );
    assert.match(
      salesContent,
      /@4xl:w-96/,
      'Sales.tsx debe usar @4xl:w-96 en la columna de cobro'
    );
    assert.match(
      salesContent,
      /ResizeObserver/,
      'Sales.tsx debe medir el contenedor con ResizeObserver'
    );
    assert.match(
      salesContent,
      /isStacked/,
      'Sales.tsx debe controlar el renderizado de la barra inferior con isStacked'
    );
  });
});
