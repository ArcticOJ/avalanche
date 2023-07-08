import {useEffect, useState} from 'react';

interface StorageHandler {
  value: string;

  get(): string;

  set(value: string): void;
}

export default function useLocalStorage(key: string, defaultValue?: string, observe = true): StorageHandler {
  const [value, setValue] = useState<string>(null);
  const onStorageChange = (e: StorageEvent) => {
    if (e.key === key)
      setValue(e.newValue);
  };
  useEffect(() => {
    setValue(localStorage.getItem(key));
    if (observe) {
      window.addEventListener('storage', onStorageChange);
      return () => window.removeEventListener('storage', onStorageChange);
    }
  }, []);
  return {
    get() {
      return localStorage.getItem(key) || defaultValue;
    },
    value: value || defaultValue || '',
    set(value) {
      localStorage.setItem(key, value);
      setValue(localStorage.getItem(key) || defaultValue);
    }
  };
}
