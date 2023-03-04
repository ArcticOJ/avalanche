import {AuthHandler, useAuth} from 'lib/hooks/useAuth';
import {useRouter} from 'next/router';
import {awaitExpression} from '@babel/types';

export default function useRequiredAuth(): AuthHandler {
  const handler = useAuth();
  const {push} = useRouter();
  if (handler.isReady && !handler.isLoggedIn) {
    push('/');
  }
  return handler;
}
