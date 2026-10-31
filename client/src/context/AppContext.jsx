import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AppContext = createContext(null);
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(() => localStorage.getItem('syntxt-theme') === 'dark');
  useEffect(() => { document.documentElement.classList.toggle('dark', dark); localStorage.setItem('syntxt-theme', dark ? 'dark' : 'light'); }, [dark]);
  useEffect(() => { api.get('/auth/me').then(response => setUser(response.data.user)).catch(() => {}).finally(() => setLoading(false)); }, []);
  const value = useMemo(() => ({ user, setUser, loading, dark, toggleTheme: () => setDark(value => !value) }), [user, loading, dark]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export const useApp = () => useContext(AppContext);

