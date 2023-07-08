import useRequiredAuth from 'lib/hooks/useRequiredAuth';
import {useEffect} from 'react';
import {useRouter} from 'next/router';

export default function Index() {
  const {isLoggedIn, user} = useRequiredAuth();
  const {push} = useRouter();
  useEffect(() => {
    if (isLoggedIn)
      push(`/profile/${user.handle}`);
  }, [isLoggedIn]);
}