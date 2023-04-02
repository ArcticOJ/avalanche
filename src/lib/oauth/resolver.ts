import type {ButtonProps, ImageProps} from '@chakra-ui/react';

const providerMetadata = {
  'github': {
    name: 'GitHub',
    shouldInvertColor: true,
    background: {
      colorScheme: 'gray'
    }
  },
  'discord': {
    name: 'Discord',
    background: {
      bg: '#9cace5',
      hover: '#8095de',
      active: '#7289da'
    }
  }
};

export function resolveName(provider: string): string {
  return Object.hasOwn(providerMetadata, provider) ? providerMetadata[provider].name : provider;
}

export function resolveProps(provider: string): {
  buttonProps: Partial<ButtonProps>,
  imageProps: Partial<ImageProps>
} {
  const buttonProps: ButtonProps = {}, imageProps: ImageProps = {
    boxSize: 4
  };
  if (Object.hasOwn(providerMetadata, provider)) {
    const m = providerMetadata[provider];
    const bg = m.background;
    imageProps.alt = buttonProps.children = m.name;
    imageProps.src = `/static/logos/${provider}.svg`;
    if (m.shouldInvertColor)
      imageProps.filter = 'invert(1)';
    if (Object.hasOwn(bg, 'colorScheme'))
      buttonProps.colorScheme = bg.colorScheme;
    else {
      buttonProps.bg = bg.bg;
      buttonProps._hover = {
        bg: bg.hover
      };
      buttonProps._active = {
        bg: bg.active
      };
    }
  }
  return {
    buttonProps,
    imageProps
  };
}
