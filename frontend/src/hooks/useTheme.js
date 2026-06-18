import { useEffect, useState } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storage.js';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const saved = getFromStorage('theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveToStorage('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme, isDark: theme === 'dark' };
};

export default useTheme;
