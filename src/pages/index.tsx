import {useRouter} from 'next/router';
import {useEffect} from 'react';

export default function Index() {
  const {push} = useRouter();
  useEffect(() => {
    push('/feeds').then();
  }, []);
  return (
    <></>
  );
}
