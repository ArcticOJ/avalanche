import 'allotment/dist/style.css';
import {Allotment} from 'allotment';
import dynamic from 'next/dynamic';
import useQuery from 'lib/hooks/useQuery';
import React, {useEffect} from 'react';
import {Code, Heading, TabPanel, TabPanels, Tabs, Text} from '@chakra-ui/react';
import {TabItem, TabItems} from 'components/TabItem';
import {Clock, FileText} from 'react-feather';
import IOSample from 'components/IOSample';
import Constraints from 'components/Constraints';

const CodeEditor = dynamic(() => import('components/CodeEditor'), {
  suspense: true,
  ssr: false
});

export default function Problem() {
  const problem = useQuery('problem');
  useEffect(() => {
    if (problem && problem.length > 0)
      fetch(`/api/problems/${problem}`).then(r => r.ok ? r.json() : {}).then(console.log);
  }, [problem]);
  return (
    <div style={{
      width: '100%',
      height: '100%'
    }}>
      <Allotment>
        <Allotment.Pane minSize={300}>
          <Tabs colorScheme='arctic' size='sm'>
            <TabItems ml={2} mt={2}>
              <TabItem icon={FileText}>
                Statement
              </TabItem>
              <TabItem icon={Clock}>
                Recent submissions
              </TabItem>
            </TabItems>
            <TabPanels>
              <TabPanel>
                <Constraints mem='256 MB' cpu='1' time='1s' />
                <Heading size='lg'>
                  Hello World
                </Heading>
                {/* TODO: make constraints collapsible */}
                <Text my={4}>
                  Print <Code>Hello, World.</Code>
                </Text>
                <IOSample label='Output'>
                  Hello, World.
                </IOSample>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Allotment.Pane>
        <Allotment.Pane minSize={500}>
          <CodeEditor />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

