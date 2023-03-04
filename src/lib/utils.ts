import {notify} from 'lib/notifications';

export function ensureClientSide<T>(callback: () => T): () => T {
  return 'window' in global ? callback : () => null;
}

interface FetchParameters<TBody, TMonitor> {
  endpoint: string;
  method?: 'POST' | 'GET' | 'PATCH' | 'DELETE';
  signal?: AbortSignal;
  monitorLatency?: TMonitor;
  body?: TBody;
  headers?: Record<string, string>;
}

export function transition(dura = 0.2, scope = 'all'): string {
  return `${scope} ${dura}s ease-in-out`;
}

export function round(num: number, precision: number) {
  const l = Math.pow(10, precision);
  return Math.round((num + Number.EPSILON) * l) / l;
}

export async function request<TBody = never, TResponse = any, TMonitor extends boolean = false>({
  endpoint,
  method,
  headers,
  body,
  monitorLatency,
  signal
}: FetchParameters<TBody, TMonitor>): Promise<TMonitor extends true ? {
  latency: number,
  response: TResponse
} : TResponse> {
  const isFormData = body instanceof FormData;
  try {
    const response = await fetch(endpoint, {
      method: method || 'GET',
      headers: {...(!isFormData && {'Content-Type': 'application/json'}), ...headers},
      signal,
      body: isFormData ? body : JSON.stringify(body)
    });
    const res = await response.json();
    const perf = performance.getEntriesByName(window.location.origin + endpoint, 'resource').pop();
    if (response.ok) {
      if (monitorLatency)
        // @ts-ignore
        return {
          latency: perf && perf instanceof PerformanceResourceTiming ? perf.responseStart - perf.requestStart : -1,
          response: res
        };
      return res;
    }
    throw new Error(res ? res.message || res.error : 'Unknown error occurred.');
  } catch (e) {
    notify('Request failed', e.message || e.name, 'error');
    throw e;
  }
}
