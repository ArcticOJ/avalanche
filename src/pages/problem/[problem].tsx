import 'allotment/dist/style.css';
import 'katex/dist/katex.min.css';
import {Allotment} from 'allotment';
import useQuery from 'lib/hooks/useQuery';
import React, {useEffect, useRef} from 'react';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  ListItem,
  Spacer,
  TabPanel,
  TabPanels,
  Tabs,
  UnorderedList,
  VStack
} from '@chakra-ui/react';
import {TabItem, TabItems} from 'components/TabItem';
import {IconFileText, IconSend} from '@tabler/icons-react';
import IOSample from 'components/IOSample';
import Constraints from 'components/Constraints';
import useFetch from 'lib/hooks/useFetch';
import {useRouter} from 'next/router';
import KaTeX from 'components/KaTeX';
import useSubmit from 'lib/hooks/useSubmit';
import {languages, options} from 'lib/constants/languages';
import ChakraSelect from 'components/ChakraSelect';
import {useCodeEditor} from 'lib/hooks/useCodeEditor';

export default function Problem() {
  const problem = useQuery('problem');
  const {submit, submitModal} = useSubmit();
  const ref = useRef<HTMLDivElement>();
  const {view, setLanguage, language} = useCodeEditor([], ref.current, 'Write your code here!');
  const {data, error} = useFetch(problem ? `/api/problems/${problem}` : null);
  const {push} = useRouter();
  useEffect(() => {
    if (!data && error)
      push('/404');
    else if (data) {
      document.title = data.title;
    }
  }, [!data && error]);
  return data && (
    <div style={{
      width: '100%',
      height: '100%'
    }}>
      {submitModal}
      <Allotment>
        <Allotment.Pane minSize={300}>
          <Tabs colorScheme='arctic' size='sm' isLazy>
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
          <Flex flexDir='column'>
            <Flex p={2} bg='gray.800' align='center'>
              <ChakraSelect value={{
                label: languages?.[language]?.name,
                value: language
              }}
              onChange={v => setLanguage((v as any).value)}
              options={options} />
              <Spacer />
              <Button fontSize='smaller' rightIcon={<IconSend size={16} />} height='30px'
                onClick={() => submit(view.state.doc.toString(), language)}>
                Submit
              </Button>
            </Flex>
            <Box ref={ref} flex={1} />
          </Flex>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
