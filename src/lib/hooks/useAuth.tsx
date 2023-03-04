import {createContext, PropsWithChildren, useContext, useMemo} from 'react';
import {User} from 'lib/types/users';
import useFetch from 'lib/hooks/useFetch';

const AuthContext = createContext<AuthHandler>({} as AuthHandler);

export interface AuthHandler {
  isLoggedIn: boolean;
  user: User;
  isReady: boolean;

  logout(): Promise<void>;

  revalidate(): Promise<void>;
}

export function useAuth(): AuthHandler {
  return useContext(AuthContext);
}

export function AuthProvider({children}: PropsWithChildren) {
  const {data, mutate, error} = useFetch<User>('/api/user', {
    shouldRetryOnError: false,
    suspense: false
  });
  const logout = async () => {
    const r = await fetch('/api/auth/logout').finally(revalidate);
    if (!r.ok)
      throw new Error();
  };
  const revalidate = async () => {
    await mutate(null, {
      rollbackOnError: true
    });
  };
  const handler = useMemo<AuthHandler>(() => ({
    isLoggedIn: !error && !!data,
    isReady: !!(data || error),
    logout,
    revalidate,
    user: error ? null : data
  }), [data, error]);
  return (
    <AuthContext.Provider value={handler}>
      {children}
    </AuthContext.Provider>
  );
}
