import {AuthHandler, useAuth} from 'lib/hooks/useAuth';
import {useRouter} from 'next/router';
import {useEffect} from 'react';

export default function useRequiredAuth(): AuthHandler {
  const handler = useAuth();
  const {push, isReady} = useRouter();
  useEffect(() => {
    if (isReady && handler.isReady && !handler.isLoggedIn) {
      push('/');
    }
  }, [isReady]);
  return handler;
}
