import {Avatar, AvatarProps} from '@chakra-ui/react';
import {useMemo} from 'react';
import md5 from 'blueimp-md5';

interface GravatarProps extends Omit<AvatarProps, 'size'> {
  email: string;
  size?: number;
}

export default function Gravatar({email, size = 32, ...props}: GravatarProps) {
  const gravatarHash = useMemo(() => {
    if (!email)
      return '';
    return md5(email.trim().toLowerCase());
  }, [email]);
  return (
    <Avatar boxSize={`${size}px`}
      src={`https://www.gravatar.com/avatar/${gravatarHash}?s=${size}&d=retro`} {...props} />
  );
}
