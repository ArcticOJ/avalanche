import {useCallback, useEffect, useState} from 'react';
import {useInterval} from '@chakra-ui/hooks';
import dayjs from 'dayjs';
import _tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(_tz);
dayjs.extend(utc);

export default function useClock(format: string, initialTimezone?: string) {
  const [time, setTime] = useState<string>('');
  const [timezone, setTimezone] = useState<string>(initialTimezone);
  const update = useCallback(() => setTime(dayjs().tz(timezone).format(format)), []);
  useInterval(update, 1e3);
  useEffect(() => {
    update();
  }, [timezone]);
  return {
    time,
    updateTimezone(_timezone: string) {
      setTimezone(_timezone);
    }
  };
}