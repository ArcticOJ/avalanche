import BaseModal from 'components/modals/BaseModal';
import Separator from 'components/Separator';
import {Box, Button, Divider, Flex, Heading, HStack, Spacer, VStack} from '@chakra-ui/react';
import {useDropzone} from 'react-dropzone';
import Prism from 'components/Prism';
import {Folder, Send} from 'react-feather';
import {prettyBytes} from 'lib/utils';

export default function Submit({isOpen, onClose, callback, isBusy}) {
  const {getRootProps, acceptedFiles, open} = useDropzone({
    accept: {
      'text/x-c': ['.cpp', '.cxx']
    },
    maxFiles: 1,
    minSize: 1,
    noClick: true,
    noKeyboard: true
  });
  return (
    <BaseModal isOpen={isOpen} title='Submit' onClose={onClose} px={6} footer={
      <HStack>
        <Button leftIcon={<Send size={16} />} isDisabled={acceptedFiles.length != 1} onClick={() => {
          callback(acceptedFiles[0]);
        }} isLoading={isBusy}
        loadingText='Submitting'>
          Submit
        </Button>
      </HStack>
    }>
      <VStack spacing={4} mb={4}>
        <Separator>
          or upload a local file
        </Separator>
        <Box w='100%' {...getRootProps()}>
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
        </Box>
      </VStack>
    </BaseModal>
  );
}
