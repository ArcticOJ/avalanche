import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import useLocalStorage from 'lib/hooks/useLocalStorage';
import templite from 'templite';

type Language = 'en' | 'vi';

interface i18nHandler {
  currentLanguage: string;

  t(key: string, obj?: object): string;

  switchLanguage(): void;
}

interface TranslationProviderProps {
  defaultLanguage: Language;
  children: ReactNode;
}

const TranslationContext = createContext<i18nHandler>({} as i18nHandler);

export function usei18n(): i18nHandler {
  return useContext(TranslationContext);
}

export function TranslationProvider({children, defaultLanguage}: TranslationProviderProps) {
  const {value, setPreferredLang} = useLocalStorage('arctic:language', defaultLanguage);
  const [translation, setTranslation] = useState<any>({});
  useEffect(() => {
    import(`i18n/${value}.yml`).then(t => setTranslation(t));
  }, [value]);
  const handler: i18nHandler = {
    t(key: string, obj: object): string {
      const transStr: any = key.split('.').reduce(
        (previous: any, current: string) =>
          (previous && previous[current]) || null,
        translation
      );
      if (!transStr)
        return null;
      return templite(transStr, obj);
    },
    currentLanguage: value,
    switchLanguage() {
      setPreferredLang(value === 'vi' ? 'en' : 'vi');
    }
  };

  return (
    <TranslationContext.Provider value={handler}>
      {children}
    </TranslationContext.Provider>
  );
}
