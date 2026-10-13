import { useEffect, useRef } from 'react';

export interface Hotkey {
  key: string;
  handler: (e: KeyboardEvent) => void;
}

const FUNCTION_KEY_REGEX = /^F(1[0-2]|[1-9])$/i;

export function useHotkeys(keys: Hotkey[]): void {
  const keysRef = useRef<Hotkey[]>(keys);
  keysRef.current = keys;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar e.repeat para evitar múltiples disparos al mantener presionada la tecla
      if (e.repeat) return;

      const pressedKey = e.key.toUpperCase();

      const matchingHotkey = keysRef.current.find(
        (hk) => hk.key.toUpperCase() === pressedKey
      );

      if (!matchingHotkey) return;

      // Para teclas F1..F12 llamar siempre preventDefault y stopPropagation ANTES del handler
      // Esto previene que el navegador (Brave, Chrome, Edge) abra menús de ayuda F1 u otras acciones nativas
      if (FUNCTION_KEY_REGEX.test(pressedKey)) {
        e.preventDefault();
        e.stopPropagation();
      }

      matchingHotkey.handler(e);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, []);
}
