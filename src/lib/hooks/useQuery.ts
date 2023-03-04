import {useRouter} from 'next/router';
import {useMemo} from 'react';

export default function useQuery(param: string): string {
  const {query, isReady} = useRouter();
  return useMemo(() => {
    if (isReady) return query[param] as string;
    else return null;
  }, [isReady]);
}
