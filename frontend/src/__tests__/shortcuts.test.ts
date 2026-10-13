import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SHORTCUTS, getShortcutByKey, getShortcutByPath } from '../lib/shortcuts';

describe('shortcuts', () => {
  it('contiene la definición de los atajos globales y de POS requeridos', () => {
    const keys = SHORTCUTS.map((s) => s.key);
    assert.ok(keys.includes('F1'));
    assert.ok(keys.includes('F2'));
    assert.ok(keys.includes('F3'));
    assert.ok(keys.includes('F4'));
    assert.ok(keys.includes('F6'));
    assert.ok(keys.includes('F7'));
    assert.ok(keys.includes('F8'));
    assert.ok(keys.includes('F9'));
    // F5 NO debe interceptarse ni existir en los atajos
    assert.ok(!keys.includes('F5'));
  });

  it('obtiene el atajo por tecla correctamente', () => {
    const f1 = getShortcutByKey('f1');
    assert.ok(f1 !== undefined);
    assert.strictEqual(f1?.path, '/dashboard/pos');

    const f8 = getShortcutByKey('F8');
    assert.strictEqual(f8?.scope, 'pos');
  });

  it('obtiene el atajo por ruta de navegación correctamente', () => {
    const inventario = getShortcutByPath('/dashboard/inventario');
    assert.strictEqual(inventario?.key, 'F2');
  });
});
