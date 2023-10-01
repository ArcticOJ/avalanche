import BaseModal from 'components/modals/BaseModal';
import {Divider, Flex, Text} from '@chakra-ui/react';
import {IconBrush, IconDroplet, IconMoon, IconSun} from '@tabler/icons-react';
import {createElement, useEffect} from 'react';

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
  return (
    <BaseModal isOpen={isOpen} title='Preferences' bodyProps={{
      px: 6,
      py: 4
    }} onClose={onClose}>
      <PreferenceItem label='Theme' icon={IconBrush}>
      </PreferenceItem>
    </BaseModal>
  );
}
