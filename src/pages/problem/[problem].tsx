import 'allotment/dist/style.css';
import {Allotment} from 'allotment';
import useQuery from 'lib/hooks/useQuery';
import React, {lazy, useEffect} from 'react';
import {Code, Heading, TabPanel, TabPanels, Tabs, Text} from '@chakra-ui/react';
import {TabItem, TabItems} from 'components/TabItem';
import {IconFileText, IconSend} from '@tabler/icons-react';
import IOSample from 'components/IOSample';
import Constraints from 'components/Constraints';

const CodeEditor = lazy(() => import('components/CodeEditor'));

const Markdown = lazy(() => import('components/Markdown'));

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
              <TabItem icon={IconFileText}>
                Statement
              </TabItem>
              <TabItem icon={IconSend}>
                Submissions
              </TabItem>
            </TabItems>
            <TabPanels>
              <TabPanel>
                <Constraints mem='256 MB' io='Standard' time='1s' />
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
                <Markdown url='/static/welcome.md' />
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
