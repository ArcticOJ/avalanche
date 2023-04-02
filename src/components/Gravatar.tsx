import {Avatar, AvatarProps} from '@chakra-ui/react';

interface GravatarProps extends Omit<AvatarProps, 'size'> {
  hash: string;
  size?: number;
}

export default function Gravatar({hash, size = 32, ...props}: GravatarProps) {
  return (
    <Avatar boxSize={`${size}px`}
      src={`https://www.gravatar.com/avatar/${hash}?s=${size}&d=retro`} {...props} />
  );
}
