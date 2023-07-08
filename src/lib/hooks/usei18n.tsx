import {createContext, ReactNode, useContext} from 'react';
import vi from 'i18n/translation.vi';
import en from 'i18n/translation.en';
import useLocalStorage from 'lib/hooks/useLocalStorage';
import templite from 'templite';

const translations = {
  vi,
  en
};

type Language = keyof typeof translations;

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
  const {value, set} = useLocalStorage('arctic:language', defaultLanguage);
  const handler: i18nHandler = {
    t(key: string, obj: object): string {
      const transStr: any = key.split('.').reduce(
        (previous: any, current: string) =>
          (previous && previous[current]) || null,
        translations[value]
      );
      const template = transStr || key;
      return templite(template, obj);
    },
    currentLanguage: value,
    switchLanguage() {
      set(value === 'vi' ? 'en' : 'vi');
    }
  };

  return (
    <TranslationContext.Provider value={handler}>
      {children}
    </TranslationContext.Provider>
  );
}
