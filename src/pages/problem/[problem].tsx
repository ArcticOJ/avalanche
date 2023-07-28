import 'allotment/dist/style.css';
import 'katex/dist/katex.min.css';
import {Allotment} from 'allotment';
import useQuery from 'lib/hooks/useQuery';
import React, {lazy, useEffect} from 'react';
import {Divider, Heading, ListItem, TabPanel, TabPanels, Tabs, UnorderedList, VStack} from '@chakra-ui/react';
import {TabItem, TabItems} from 'components/TabItem';
import {IconFileText, IconSend} from '@tabler/icons-react';
import IOSample from 'components/IOSample';
import Constraints from 'components/Constraints';
import useFetch from 'lib/hooks/useFetch';
import {useRouter} from 'next/router';
import KaTeX from 'components/KaTeX';
import {brandName} from 'lib/branding';
import useSubmit from 'lib/hooks/useSubmit';

const CodeEditor = lazy(() => import('components/CodeEditor'));

export default function Problem() {
  const problem = useQuery('problem');
  const {} = useSubmit();
  const {data, error} = useFetch(problem ? `/api/problems/${problem}` : null);
  const {push} = useRouter();
  useEffect(() => {
    if (!data && error)
      push('/404');
    else if (data) {
      document.title = `${brandName} | ${data.title}`;
    }
  }, [!data && error]);
  return data && (
    <div style={{
      width: '100%',
      height: '100%'
    }}>
      <Allotment>
        <Allotment.Pane minSize={300}>
          <Tabs colorScheme='arctic' size='sm'>
            <TabItems ml={2} mt={2} justify='center'>
              <TabItem icon={IconFileText}>
                Statement
              </TabItem>
              <TabItem icon={IconSend}>
                Submissions
              </TabItem>
            </TabItems>
            <TabPanels>
              <TabPanel>
                <Constraints mem={`${data.constraints.memoryLimit} MB`} io='Standard' time='1s' />
                <Heading size='xl' mb={8}>
                  {data.title}
                </Heading>
                {/* TODO: make constraints collapsible */}
                <KaTeX my={4}>
                  {data.statement}
                </KaTeX>
                <VStack spacing={4} align='stretch'>
                  <Heading as='h3' size='md'>
                    Input
                  </Heading>
                  <KaTeX ml={2}>
                    {data.input}
                  </KaTeX>
                  <Heading as='h3' size='md'>
                    Output
                  </Heading>
                  <KaTeX ml={2}>
                    {data.output}
                  </KaTeX>
                  {Array.isArray(data.scoring) && (
                    <>
                      <Heading as='h3' size='md'>
                        Scoring
                      </Heading>
                      <KaTeX ml={2}>
                        <UnorderedList>
                          {data.scoring.map((s, i) => (
                            <ListItem key={i}>
                              {s}
                            </ListItem>
                          ))}
                        </UnorderedList>
                      </KaTeX>
                    </>
                  )}
                </VStack>
                <Divider my={4} />
                {(data.sampleTestCases || []).map((_case, i) => (
                  <IOSample num={i + 1} input={_case.input} output={_case.output} note={_case.note} key={i} />
                ))}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Allotment.Pane>
        <Allotment.Pane minSize={500}>
          <CodeEditor onSubmit={(code, lang) => console.log(code, lang)} />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
