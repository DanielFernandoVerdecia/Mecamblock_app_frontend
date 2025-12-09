import { writable } from 'svelte/store';

interface AuthState {
  isLoggedIn: boolean;
  user: string | null;
}

const STORAGE_KEY = 'auth_state';

function createAuthStore() {
  // Inicializar desde localStorage de forma síncrona
  let initialState: AuthState = { isLoggedIn: false, user: null };
  
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        initialState = JSON.parse(stored);
      } catch (e) {
        console.error('Error al cargar auth:', e);
      }
    }
  }

  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,
    login: (username: string, password: string) => {
      // Credenciales hardcodeadas
      if (username === 'admin' && password === 'admin') {
        const newState: AuthState = { isLoggedIn: true, user: username };
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        }
        set(newState);
        return true;
      }
      return false;
    },
    logout: () => {
      const newState: AuthState = { isLoggedIn: false, user: null };
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }
      set(newState);
    }
  };
}

export const authStore = createAuthStore();
