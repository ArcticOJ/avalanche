import 'allotment/dist/style.css';
import {Allotment} from 'allotment';
import dynamic from 'next/dynamic';
import useQuery from 'lib/hooks/useQuery';
import React, {useEffect} from 'react';
import {Box, IconButton, TabPanel, TabPanels, Tabs} from '@chakra-ui/react';
import {TabItem, TabItems} from 'components/TabItem';
import {Clipboard, Clock, FileText} from 'react-feather';

const CodeEditor = dynamic(() => import('components/CodeEditor'), {
  suspense: true
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
                Description
              </TabItem>
              <TabItem icon={Clock}>
                Recent submissions
              </TabItem>
              <TabItem>
                {problem}
              </TabItem>
            </TabItems>
            <TabPanels>
              <TabPanel>
                <Box bg='gray.800' p={4} borderRadius='2xl' position='relative' fontWeight={600} fontSize={14}>
                  <IconButton display='flex' aria-label='Copy to clipboard'
                    position='absolute' right={4} top={4}>
                    <Clipboard size={16} />
                  </IconButton>
                  <p>
                    <code>
                      6
                    </code>
                    <br />
                    <code>
                      5 7 9 6 8 10
                    </code>
                  </p>
                </Box>
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

