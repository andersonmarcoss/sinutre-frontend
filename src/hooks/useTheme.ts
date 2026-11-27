import { useEffect, useState } from 'react';

export const THEMES = [
  { id: 'sinutre', label: 'Claro', swatch: 'oklch(52% 0.17 155)' },
  { id: 'sinutre-escuro', label: 'Escuro', swatch: 'oklch(24% 0.015 160)' },
  { id: 'sinutre-oceano', label: 'Oceano', swatch: 'oklch(52% 0.19 250)' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

const THEME_STORAGE_KEY = 'sinutre.theme';
const DEFAULT_THEME: ThemeId = 'sinutre';

function isValidTheme(value: string | null): value is ThemeId {
  return THEMES.some((t) => t.id === value);
}

export function getSavedTheme(): ThemeId {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  return isValidTheme(saved) ? saved : DEFAULT_THEME;
}

export function initTheme() {
  document.documentElement.dataset.theme = getSavedTheme();
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeId>(getSavedTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return { theme, setTheme, themes: THEMES };
}