import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserPreferences } from '../types/user.types';
import storageService from '../services/storage';

// App state interface
interface AppState {
  user: {
    preferences: UserPreferences;
  };
  ui: {
    theme: 'light' | 'dark' | 'system';
    loading: boolean;
    error: string | null;
    isMenuOpen: boolean;
    isSearchOpen: boolean;
  };
}

// Action types
type AppAction =
  | { type: 'SET_PREFERENCES'; payload: UserPreferences }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'system' }
  | { type: 'SET_READING_MODE'; payload: 'scroll' | 'page' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_MENU' }
  | { type: 'CLOSE_MENU' }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'CLOSE_SEARCH' }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  user: {
    preferences: storageService.getUserPreferences(),
  },
  ui: {
    theme: storageService.getUserPreferences().theme,
    loading: false,
    error: null,
    isMenuOpen: false,
    isSearchOpen: false,
  },
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PREFERENCES':
      storageService.setUserPreferences(action.payload);
      return {
        ...state,
        user: {
          ...state.user,
          preferences: action.payload,
        },
        ui: {
          ...state.ui,
          theme: action.payload.theme,
        },
      };

    case 'SET_THEME':
      const updatedPreferences = {
        ...state.user.preferences,
        theme: action.payload,
      };
      storageService.setUserPreferences(updatedPreferences);
      return {
        ...state,
        user: {
          ...state.user,
          preferences: updatedPreferences,
        },
        ui: {
          ...state.ui,
          theme: action.payload,
        },
      };

    case 'SET_READING_MODE':
      const updatedReadingPreferences = {
        ...state.user.preferences,
        readingMode: action.payload,
      };
      storageService.setUserPreferences(updatedReadingPreferences);
      return {
        ...state,
        user: {
          ...state.user,
          preferences: updatedReadingPreferences,
        },
      };

    case 'SET_LOADING':
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: action.payload,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload,
        },
      };

    case 'TOGGLE_MENU':
      return {
        ...state,
        ui: {
          ...state.ui,
          isMenuOpen: !state.ui.isMenuOpen,
          isSearchOpen: false, // Close search when opening menu
        },
      };

    case 'CLOSE_MENU':
      return {
        ...state,
        ui: {
          ...state.ui,
          isMenuOpen: false,
        },
      };

    case 'TOGGLE_SEARCH':
      return {
        ...state,
        ui: {
          ...state.ui,
          isSearchOpen: !state.ui.isSearchOpen,
          isMenuOpen: false, // Close menu when opening search
        },
      };

    case 'CLOSE_SEARCH':
      return {
        ...state,
        ui: {
          ...state.ui,
          isSearchOpen: false,
        },
      };

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Convenience functions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setReadingMode: (mode: 'scroll' | 'page') => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleMenu: () => void;
  closeMenu: () => void;
  toggleSearch: () => void;
  closeSearch: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Apply theme to document on mount and when theme changes
  useEffect(() => {
    const root = document.documentElement;
    const theme = state.ui.theme;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // system theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [state.ui.theme]);

  // Convenience functions
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const setReadingMode = (mode: 'scroll' | 'page') => {
    dispatch({ type: 'SET_READING_MODE', payload: mode });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const toggleMenu = () => {
    dispatch({ type: 'TOGGLE_MENU' });
  };

  const closeMenu = () => {
    dispatch({ type: 'CLOSE_MENU' });
  };

  const toggleSearch = () => {
    dispatch({ type: 'TOGGLE_SEARCH' });
  };

  const closeSearch = () => {
    dispatch({ type: 'CLOSE_SEARCH' });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    setTheme,
    setReadingMode,
    setLoading,
    setError,
    toggleMenu,
    closeMenu,
    toggleSearch,
    closeSearch,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;