import BaseModal from 'components/modals/BaseModal';
import {Box, Button, Center, Fade, Flex, Heading, HStack, Link, Spacer, Text, VStack} from '@chakra-ui/react';
import {useDropzone} from 'react-dropzone';
import {IconCopy, IconFolder, IconSend, IconSourceCode, IconTerminal, IconUpload} from '@tabler/icons-react';
import {Segment, SegmentedControl} from 'components/SegmentedControl';
import TextBox from 'components/TextBox';
import useFetch from 'lib/hooks/useFetch';
import templite from 'templite';
import {ensureClientSide} from 'lib/utils/common';
import React, {useRef, useState} from 'react';
import {useCodeEditor} from 'lib/hooks/useCodeEditor';
import ChakraSelect from 'components/ChakraSelect';
import {languages, options} from 'lib/constants/languages';
import useQuery from 'lib/hooks/useQuery';

const supportedCli = [
  {
    name: 'iceberg',
    url: 'https://github.com/ArcticOJ/iceberg',
    command: 'iceberg submit {{problem}} {{pathToFile}}'
  },
  {
    name: 'curl',
    url: 'https://curl.se',
    command: 'curl -F "streamed=true" -F "code=@{{pathToFile}}" -N -H "Authorization: Bearer {{apiKey}}" {{origin}}/api/problems/{{problem}}/submit'
  },
  {
    name: 'wget',
    url: 'https://www.gnu.org/software/wget',
    command: 'not implemented'
  }
];

function SubmitFromCLI() {
  const {data} = useFetch('/api/user/apiKey', {
    fallbackData: {
      apiKey: '<your_api_key>'
    }
  });
  const problem = useQuery('problem');
  return (
    <Box>
      <VStack align='stretch' my={2} spacing={4}>
        {supportedCli.map(({name, url, command}) => <VStack key={name} align='left'>
          <Heading size='xs' as='h6' ml={2}>
              Via <Link target='_blank' href={url} color='arctic.300'>{name}</Link>
          </Heading>
          <Flex gap={2}>
            <TextBox isReadOnly flex={1} fontFamily='mono' wordBreak='break-word'
              value={templite(command, {
                origin: ensureClientSide(() => window.location.origin)(),
                problem: problem,
                apiKey: data.apiKey,
                pathToFile: `${problem}.<ext>`
              })} />
            <Button leftIcon={<IconCopy size={16} />}>
                Copy
            </Button>
          </Flex>
        </VStack>
        )}
      </VStack>
    </Box>
  );
}

function SubmitSourceCode({code, lang, callback, isBusy}) {
  const ref = useRef<HTMLDivElement>();
  const {getRootProps, getInputProps, open, isDragAccept, isDragReject, isDragActive} = useDropzone({
    accept: {
      'text/x-c++src': ['.cpp', '.cxx'],
      'text/x-python': ['.py']
    },
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    minSize: 1,
    async onDrop(files) {
      console.log(files);
      if (files.length != 1) return;
      setCode({
        name: files[0].name,
        content: await files[0].text()
      });
    }
  });
  const [_code, setCode] = useState({
    name: 'source code',
    content: code
  });
  const {view, setLanguage, language} = useCodeEditor([], ref.current, 'Write your code here!', _code.content, true);
  return (
    <Box>
      <Flex flexDir='column' {...getRootProps()}>
        <input {...getInputProps()} />
        <HStack bg='gray.900' borderTopRadius='lg' pl={4} pr={2} py={1}>
          <Text fontWeight={700} fontSize='xs'>
            {_code.name}
          </Text>
          <Spacer />
          <ChakraSelect value={{
            label: languages?.[language]?.name,
            value: language
          }}
          onChange={v => setLanguage((v as any).value)}
          options={options} />
          <Button size='xs' leftIcon={<IconFolder size={12} />} onClick={open}>
            Browse
          </Button>
        </HStack>
        <Box flex={1}>
          <Fade in={isDragActive} unmountOnExit>
            <Center borderRadius='xl'
              w='100%'
              borderWidth={2} borderStyle='dashed'
              borderColor={isDragReject ? 'red.400' : isDragAccept ? 'green.400' : 'arctic.400'}
              bg='gray.900' py={4} px={8}>
              <VStack>
                <IconUpload size={28} />
                <Heading size='xs' as='h6'>
                  Drop here to upload!
                </Heading>
              </VStack>
            </Center>
          </Fade>
          <Box ref={ref} display={isDragActive ? 'none' : 'block'} />
        </Box>
      </Flex>
      <Button mt={2} w='100%' leftIcon={<IconSend size={16} />}
        onClick={() => callback(view.state.doc.toString(), language)} isLoading={isBusy}
        loadingText='Submitting'>
        Submit
      </Button>
    </Box>
  );
}

export default function Submit({
  isOpen, onClose, callback, isBusy, code, lang
}) {
  return (
    <BaseModal size='2xl' isOpen={isOpen} title='Submit' onClose={onClose} bodyProps={{
      px: 6
    }}>
      <VStack spacing={4} mb={4} align='stretch'>
        <SegmentedControl items={[
          <Segment key='src' icon={IconSourceCode} label='Source code' />,
          <Segment key='cli' icon={IconTerminal} label='From CLI' />
        ]}>
          <SubmitSourceCode code={code} lang={lang} callback={callback} isBusy={isBusy} />
          <SubmitFromCLI />
        </SegmentedControl>
      </VStack>
    </BaseModal>
  );
}
