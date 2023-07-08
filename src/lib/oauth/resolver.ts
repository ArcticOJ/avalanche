import type {ButtonProps} from '@chakra-ui/react';
import Discord from 'components/icons/Discord';
import GitHub from 'components/icons/GitHub';
import {createElement} from 'react';
import {Icon} from '@tabler/icons-react';

const providerMetadata = {
  'github': {
    name: 'GitHub',
    icon: GitHub,
    background: {
      colorScheme: 'gray'
    }
  },
  'discord': {
    name: 'Discord',
    icon: Discord,
    background: {
      bg: '#9cace5',
      hover: '#8095de',
      active: '#7289da'
    }
  }
};

export function resolveProvider(provider: string): { name: string, icon: Icon } {
  if (!Object.hasOwn(providerMetadata, provider)) return null;
  const metadata = providerMetadata[provider];
  return {
    name: metadata.name || provider,
    icon: metadata.icon
  };
}

export function resolveProps(provider: string): Partial<ButtonProps> {
  const buttonProps: ButtonProps = {};
  if (Object.hasOwn(providerMetadata, provider)) {
    const m = providerMetadata[provider];
    const bg = m.background;
    buttonProps.children = m.name;
    if (m.icon)
      buttonProps.leftIcon = createElement(m.icon, {
        size: 16
      });
    if (bg.colorScheme) {
      buttonProps.colorScheme = bg.colorScheme;
    } else {
      buttonProps.bg = bg.bg;
      buttonProps._hover = {
        bg: bg.hover
      };
      buttonProps._active = {
        bg: bg.active
      };
    }
  }
  return buttonProps;
}
