import useSWR, {BareFetcher, SWRResponse} from 'swr';
import type {RestError} from 'lib/types/common';
import type {PublicConfiguration} from 'swr/_internal';

type Err = RestError | Error;
type Options<T> = Partial<PublicConfiguration<T, Err, BareFetcher<T>>>;

export default function useFetch<T = any>(endpoint: string, options?: Options<T>): SWRResponse<T, Err> {
  return useSWR<T, Err>(endpoint, (u: string) =>
    fetch(u).then(r => {
      if (!r.ok) throw new Error(r.status.toString());
      return r.json();
    }).then(r => {
      if (r.message) throw new Error(r.message);
      return r;
    }), {suspense: true, ...options});
}
