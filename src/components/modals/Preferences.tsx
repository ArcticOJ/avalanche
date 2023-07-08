import BaseModal from 'components/modals/BaseModal';
import {Divider, Flex, Text} from '@chakra-ui/react';
import ChakraSelect from 'components/ChakraSelect';
import {IconBrush, IconDroplet, IconMoon, IconSun} from '@tabler/icons-react';
import {createElement, useEffect} from 'react';
import {create} from 'zustand';
import {produce} from 'immer';
import {persist} from 'zustand/middleware';

function PreferenceItem({icon, label, children}) {
  return (
    <>
      <Flex alignItems='center' gap={2}>
        {createElement(icon, {
          size: 16,
          color: 'var(--chakra-colors-arctic-300)'
        })}
        <Text flex={1} fontWeight='semibold' fontSize='sm'>
          {label}
        </Text>
        {children}
      </Flex>
      <Divider my={1} />
    </>
  );
}

type _Theme = 'dynamic' | 'dark' | 'light';
type _Language = 'en' | 'vi';

interface PreferencesHandler {
  preferences: {
    theme: _Theme;
    language: _Language;
  };

  changeTheme(theme: _Theme): void;

  changeLanguage(language: _Language): void;
}

const usePreferences = create<PreferencesHandler>()(
  persist(
    (set, get) => ({
      preferences: {
        theme: 'dynamic',
        language: 'en'
      },
      changeTheme: (theme: string) => set(produce(state => {
        console.log(theme);
        state.preferences.theme = theme;
      })),
      changeLanguage: (language: string) => set(produce(state => {
        state.preferences.language = language;
      }))
    }),
    {
      name: 'arctic:preferences'
    }
  )
);

const themeOptions = [
  {
    label: 'Dark',
    value: 'dark',
    icon: <IconMoon size={14} />
  },
  {
    label: 'Light',
    value: 'light',
    icon: <IconSun size={14} />
  },
  {
    label: 'Follow system',
    value: 'dynamic',
    icon: <IconDroplet size={14} />
  }
];

export default function Preferences({isOpen, onClose}) {
  useEffect(() => {
    console.log('render');
  }, []);
  const {preferences, changeLanguage, changeTheme} = usePreferences();
  return (
    <BaseModal isOpen={isOpen} title='Preferences' bodyProps={{
      px: 6,
      py: 4
    }} onClose={onClose}>
      <PreferenceItem label='Theme' icon={IconBrush}>
        <ChakraSelect value={preferences.theme} onChange={r => console.log(r)} options={themeOptions} />
      </PreferenceItem>
    </BaseModal>
  );
}
