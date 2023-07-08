import {useRouter} from 'next/router';
import {useMemo} from 'react';

export default function useQuery(param: string): string {
  const {query, isReady} = useRouter();
  return useMemo(() => {
    if (query) return query[param] as string;
    else return null;
  }, [isReady]);
}
