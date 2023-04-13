import {DependencyList, useCallback} from 'react';
import throttle from 'lodash.throttle';

export default function useThrottle<Func extends (...args: any) => any>(callback: Func, wait: number, deps: DependencyList = []) {
  return useCallback(throttle(callback, wait), deps);
}
