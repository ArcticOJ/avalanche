import {CloseButton, Flex, Heading, HStack, Spinner, Text, VStack} from '@chakra-ui/react';
import {ReactNode} from 'react';
import type {ToastStatus} from '@chakra-ui/toast/dist/toast.types';

interface NotificationProps {
  title?: string | ReactNode;
  message?: string | ReactNode;
  icon?: ReactNode;
  status?: ToastStatus;

  onClose();
}

function getStatusColor(status: ToastStatus): string {
  return status === 'error' ? 'red.900' : status === 'warning' ? 'yellow.900' : status === 'success' ? 'green.900' : 'gray.800';
}

export default function Notification({title, message, icon, onClose, status}: NotificationProps) {
  return (
    <VStack shadow='xl' pr={2} pl={4} py={2} bg={getStatusColor(status)} borderRadius='xl' align='stretch'>
      <Flex gap={4} alignItems='center'>
        <HStack spacing={2} flex={1}>
          {status === 'loading' ? <Spinner size='xs' /> : icon}
          <Heading size='xs' as='h6'>{title}</Heading>
        </HStack>
        <CloseButton borderRadius='xl' onClick={onClose} />
      </Flex>
      <Text fontSize='sm'>
        {message}
      </Text>
    </VStack>
  );
}
