import {useEffect, useState} from 'react';

interface DebouncedValueHandler {
  debouncedValue: string;

  commit();
}

export default function useDebouncedValue(value: string, timeout = 500, defaultValue?: string): DebouncedValueHandler {
  const [dVal, setDVal] = useState(defaultValue || '');
  useEffect(() => {
    const id = setTimeout(() => setDVal(value), timeout);
    return () => clearTimeout(id);
  }, [value]);
  return {
    debouncedValue: dVal,
    commit() {
      setDVal(value);
    }
  };
}
