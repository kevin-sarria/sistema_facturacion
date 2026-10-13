import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { useToastStore, toast } from '../stores/useToastStore';

describe('useToastStore', () => {
  beforeEach(() => {
    useToastStore.getState().clearToasts();
  });

  it('agrega avisos correctamente', () => {
    toast.success('Producto guardado');
    const state = useToastStore.getState();
    assert.strictEqual(state.toasts.length, 1);
    assert.strictEqual(state.toasts[0].message, 'Producto guardado');
    assert.strictEqual(state.toasts[0].type, 'success');
  });

  it('deduplica mensajes idénticos consecutivos', () => {
    toast.error('Error al conectar');
    toast.error('Error al conectar');
    const state = useToastStore.getState();
    assert.strictEqual(state.toasts.length, 1);
  });

  it('mantiene como máximo 3 avisos visibles simultáneos', () => {
    toast.info('Mensaje 1');
    toast.info('Mensaje 2');
    toast.info('Mensaje 3');
    toast.info('Mensaje 4');

    const state = useToastStore.getState();
    assert.strictEqual(state.toasts.length, 3);
    assert.strictEqual(state.toasts[2].message, 'Mensaje 4');
  });

  it('elimina un aviso específico', () => {
    toast.info('Aviso a eliminar');
    const id = useToastStore.getState().toasts[0].id;
    useToastStore.getState().removeToast(id);
    assert.strictEqual(useToastStore.getState().toasts.length, 0);
  });
});
