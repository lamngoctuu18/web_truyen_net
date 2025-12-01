import { useState, useEffect, useCallback } from 'react';

/**
 * Generic localStorage hook
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue: T | ((prev: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  // Listen to storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [value, setStoredValue];
}

/**
 * Hook for managing localStorage with expiry
 */
export function useLocalStorageWithExpiry<T>(
  key: string,
  defaultValue: T,
  expiryMs: number = 24 * 60 * 60 * 1000 // 24 hours default
): [T, (value: T) => void, () => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        const now = new Date().getTime();
        
        if (parsed.expiry && now > parsed.expiry) {
          // Data has expired
          localStorage.removeItem(key);
          return defaultValue;
        }
        
        return parsed.value || defaultValue;
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    return defaultValue;
  });

  const setValueWithExpiry = useCallback((newValue: T) => {
    try {
      const now = new Date().getTime();
      const item = {
        value: newValue,
        expiry: now + expiryMs,
      };
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, expiryMs]);

  const clearValue = useCallback(() => {
    try {
      localStorage.removeItem(key);
      setValue(defaultValue);
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  return [value, setValueWithExpiry, clearValue];
}

/**
 * Hook for managing boolean localStorage values (toggles)
 */
export function useLocalStorageToggle(
  key: string,
  defaultValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useLocalStorage(key, defaultValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, [setValue]);

  return [value, toggle, setValue];
}