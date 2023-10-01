import {useEffect, useState} from 'react';

interface StorageHandler {
  value: string;

  getPreferredLang(): string;

  setPreferredLang(value: string): void;
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
    getPreferredLang() {
      return localStorage.getItem(key) || defaultValue;
    },
    value: value || defaultValue || '',
    setPreferredLang(value) {
      localStorage.setItem(key, value);
      setValue(localStorage.getItem(key) || defaultValue);
    }
  };
}
