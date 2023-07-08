import {Avatar, AvatarProps} from '@chakra-ui/react';
import md5 from 'md5';

interface GravatarProps extends Omit<AvatarProps, 'size'> {
  hash?: string;
  email: string;
  size?: number;
}

export default function Gravatar({email, hash = null, size = 32, ...props}: GravatarProps) {
  const _hash = hash || (email ? md5(email) : '');
  return (
    <Avatar boxSize={`${size}px`}
      src={`https://www.gravatar.com/avatar/${_hash}?s=${size}&d=retro`} {...props}
      crossOrigin='anonymous' referrerPolicy='same-origin' />
  );
}
