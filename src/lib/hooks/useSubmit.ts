import {useCallback, useState} from 'react';
import {Verdict} from 'lib/types/submissions';
import throttle from 'lodash.throttle';
import useQuery from 'lib/hooks/useQuery';

interface JudgementStatus {
  status: Verdict;
  timestamp: Date;
  message: string;
}

interface SubmitHandler {
  status: Verdict;

  submit(): Promise<void>;
}

export default function useSubmit(): SubmitHandler {
  const [finalStatus, setFinalStatus] = useState<Verdict>(Verdict.None);
  const problem = useQuery('problem');
  const [busy, setBusy] = useState(false);
  const onSubmit = useCallback(throttle(async () => {
    setBusy(true);
    const r = await fetch(`/api/contests/${problem}/submit`, {
      method: 'POST'
    });
    if (r.ok) {
      const reader = r.body.pipeThrough(new TextDecoderStream()).getReader();
      while (true) {
        const {done, value} = await reader.read();
        if (done)
          break;
        for (const d of value.split('\n').map(f => f.trim()).filter(f => f !== '')) {
          const data: JudgementStatus = JSON.parse(d);
          if (!data) break;
          setFinalStatus(data.status);
          if (data.status !== Verdict.Pending)
            break;
        }
      }
      setBusy(false);
    } else
      setBusy(false);
    setTimeout(() => setFinalStatus(Verdict.None), 2e3);
  }, 2e3),
  []);
  return {
    status: finalStatus,
    submit: onSubmit
  };
}
