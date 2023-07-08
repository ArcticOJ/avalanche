import {request} from 'lib/utils/common';
import {useEffect, useState} from 'react';

interface RequestHandler<T> {
  latency: number;
  data: T | undefined;

  request();
}

export default function useRequest<T>(endpoint: string): RequestHandler<T> {
  const [data, setData] = useState<T>();
  const [latency, setLatency] = useState(0);
  const req = async () => {
    const res = await request<never, T, true>({
      endpoint,
      monitorLatency: true
    });
    setLatency(res.latency);
    if (res.response != null)
      setData(res.response);
  };
  useEffect(() => {
    req();
  }, []);
  return {
    request: req,
    latency,
    data
  };
}
