import useSWR, {BareFetcher, SWRResponse} from 'swr';
import type {RestError} from 'lib/types/common';
import type {PublicConfiguration} from 'swr/_internal';

type Err = RestError | Error;
type Options<T> = Partial<PublicConfiguration<T, Err, BareFetcher<T>>>;

export default function useFetch<T = any>(endpoint: string, options?: Options<T>): SWRResponse<T, Err> {
  return useSWR<T, Err>(endpoint, async (u: string) => {
    const r = await fetch(u);
    if (!r.ok) {
      const e = new Error('Failed to fetch data');
      e['info'] = await r.json();
      e['status'] = r.status;
      throw e;
    }
    return r.json();
  }, {suspense: true, ...options});
}
