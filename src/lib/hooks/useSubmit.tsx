import {lazy, ReactElement, useState} from 'react';
import {Verdict} from 'lib/types/submissions';
import useQuery from 'lib/hooks/useQuery';
import {useBoolean, useDisclosure} from '@chakra-ui/react';
import useThrottle from 'lib/hooks/useThrottle';
import {notify} from 'lib/notifications';

interface JudgementStatus {
  status: Verdict;
  timestamp: Date;
  message: string;
}

interface SubmitHandler {
  submitModal: ReactElement;
  status: Verdict;

  submit(): void;
}

const SubmitModal = lazy(() => import('components/modals/Submit'));

export default function useSubmit(): SubmitHandler {
  const [finalStatus, setFinalStatus] = useState<Verdict>(Verdict.None);
  const problem = useQuery('problem');
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [busy, {off, on}] = useBoolean();
  const onSubmit = useThrottle(async (file: File) => {
    on();
    const formData = new FormData();
    formData.append('code', file);
    const r = await fetch(`/api/contests/${problem}/submit`, {
      method: 'POST',
      body: formData
    });
    if (r.ok && r.body) {
      const reader = r.body.pipeThrough(new TextDecoderStream()).getReader();
      while (true) {
        const {done, value} = await reader.read();
        if (done)
          break;
        for (const d of value.split('\n').map(f => f.trim()).filter(f => f !== '')) {
          const data: JudgementStatus = JSON.parse(d);
          notify('Response', JSON.stringify(data));
          if (!data) break;
          setFinalStatus(data.status);
          if (data.status !== Verdict.Pending)
            break;
        }
      }
      off();
    } else
      off();
    setTimeout(() => setFinalStatus(Verdict.None), 2e3);
  }, 2e3);
  const modal = (
    <SubmitModal isOpen={isOpen} onClose={onClose} callback={onSubmit} isBusy={busy} />
  );
  return {
    submitModal: modal,
    status: finalStatus,
    submit: onOpen
  };
}
