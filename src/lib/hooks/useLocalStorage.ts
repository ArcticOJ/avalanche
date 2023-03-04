import {useEffect, useRef, useState} from 'react';

interface StorageHandler<T> {
  value: T | string;

  set(value: string): void;
}

export default function useLocalStorage<T extends string>(key: string, defaultValue?: T, observe = true): StorageHandler<T> {
  const [value, setValue] = useState<T | string>(null);
  const storage = useRef<Storage>();
  const onStorageChange = (e: StorageEvent) => {
    if (e.key == key)
      setValue(e.newValue);
  };
  useEffect(() => {
    storage.current = localStorage;
    setValue(localStorage.getItem(key) || defaultValue);
    if (observe) {
      window.addEventListener('storage', onStorageChange);
      return () => window.removeEventListener('storage', onStorageChange);
    }
  });
  return {
    value,
    set(value: string) {
      localStorage.setItem(key, value);
      setValue(localStorage.getItem(key) || defaultValue);
    }
  };
}
