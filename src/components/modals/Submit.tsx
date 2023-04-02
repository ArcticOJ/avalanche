import BaseModal from 'components/modals/BaseModal';
import {Box, Button, Flex, Heading, Link, VStack} from '@chakra-ui/react';
import {useDropzone} from 'react-dropzone';
import {Clipboard, Code, Folder, Send, Terminal, UploadCloud} from 'react-feather';
import {Segment, SegmentedControl} from 'components/SegmentedControl';
import TextBox from 'components/TextBox';
import useFetch from 'lib/hooks/useFetch';
import templite from 'templite';
import {ensureClientSide} from 'lib/utils';
import useDebouncedValue from 'lib/hooks/useDebouncedValue';
import {useState} from 'react';

const supportedCli = [
  {
    name: 'iceberg',
    url: 'https://github.com/ArcticOJ/iceberg',
    command: 'iceberg submit {{problem}} {{pathToFile}}'
  },
  {
    name: 'curl',
    url: 'https://curl.se',
    command: 'curl -F "streamed=true" -F "code=@{{pathToFile}}" -N -H "Authorization: Bearer {{apiKey}}" {{origin}}/api/contests/{{problem}}/submit'
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
  const [path, setPath] = useState('');
  const {debouncedValue} = useDebouncedValue(path, 100);
  return (
    <Box>
      <VStack align='stretch' my={2} spacing={4}>
        <TextBox icon={Folder} placeholder='Path to your code' value={path} onChange={e => setPath(e.target.value)} />
        {supportedCli.map(({name, url, command}) => <VStack key={name} align='left'>
          <Heading size='xs' as='h6' ml={2}>
              Via <Link target='_blank' href={url} color='arctic.300'>{name}</Link>
          </Heading>
          <Flex gap={2}>
            <TextBox isReadOnly flex={1} fontFamily='Inconsolata' wordBreak='break-word' value={templite(command, {
              origin: ensureClientSide(() => window.location.origin)(),
              problem: 'hello-world',
              apiKey: data.apiKey,
              pathToFile: debouncedValue
            })} />
            <Button leftIcon={<Clipboard size={16} />}>
                Copy
            </Button>
          </Flex>
        </VStack>
        )}
      </VStack>
    </Box>
  );
}

export default function Submit({isOpen, onClose, callback, isBusy}) {
  const {getRootProps, getInputProps, acceptedFiles} = useDropzone({
    accept: {
      'text/x-c++src': ['.cpp', '.cxx'],
      'text/x-python': ['.py']
    },
    maxFiles: 1,
    minSize: 1
  });
  return (
    <BaseModal size='md' isOpen={isOpen} title='Submit' onClose={onClose} bodyProps={{
      px: 6
    }}>
      <VStack spacing={4} mb={4} align='stretch'>
        <SegmentedControl items={
          <>
            <Segment icon={Folder} label='Local file' />
            <Segment icon={Code} label='Current code' />
            <Segment icon={Terminal} label='From CLI' />
          </>
        }>
          <Box>
            <VStack {...getRootProps()} cursor='pointer' borderWidth={2} borderColor='arctic.300' borderStyle='dashed'
              borderRadius='xl'
              w='100%' p={6}>
              <UploadCloud size={28} />
              <Heading size='xs' as='h6'>
                Click or drag and drop here to upload
              </Heading>
              <input {...getInputProps()} />
            </VStack>
            <Button mt={2} w='100%' leftIcon={<Send size={16} />} isDisabled={acceptedFiles.length != 1}
              onClick={() => {
                callback(acceptedFiles[0]);
              }} isLoading={isBusy}
              loadingText='Submitting'>
              Submit
            </Button>
          </Box>
          {/*<Box w='100%' {...getRootProps()}>
            <Flex p={1} bg='gray.900' borderTopRadius='xl' alignItems='center' pl={4}>
              {acceptedFiles.length === 1 && (
                <Heading size='xs'>
                  {acceptedFiles[0].name} ({prettyBytes(acceptedFiles[0].size)})
                </Heading>
              )}
              <Spacer />
              <Button onClick={open} borderRadius='lg' leftIcon={<Folder size={12} />} size='xs'>
                Browse
              </Button>
            </Flex>
            <Divider />
            <Prism code={acceptedFiles[0] ? acceptedFiles[0].text() : ''} language='cpp' />
          </Box>*/}
          <Box>

          </Box>
          <SubmitFromCLI />
        </SegmentedControl>
      </VStack>
    </BaseModal>
  );
}
