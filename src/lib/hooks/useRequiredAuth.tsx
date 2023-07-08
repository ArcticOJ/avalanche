import {AuthHandler, useAuth} from 'lib/hooks/useAuth';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {notify} from 'lib/notifications';

export default function useRequiredAuth(): AuthHandler {
  const handler = useAuth();
  const {push} = useRouter();
  useEffect(() => {
    if (handler.isReady && !handler.isLoggedIn) {
      push('/');
      notify('Unauthenticated', 'Please login to access this page.');
    }
  }, []);
  return handler;
}
