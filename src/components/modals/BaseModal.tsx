import {
  CloseButton,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalContent,
  ModalFooter,
  ModalOverlay
} from '@chakra-ui/react';
import {ReactNode} from 'react';

interface BaseModalProps extends ModalBodyProps {
  isOpen: boolean;
  title: string;
  footer?: ReactNode;

  onClose(): void;

}

export default function BaseModal({isOpen, onClose, title, children, footer, ...props}: BaseModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='sm'>
      <ModalOverlay />
      <ModalContent bg='gray.800' borderRadius='xl'>
        <Flex alignItems='center' my={4} mx={6}>
          <Heading fontWeight={700} fontSize='lg' flex={1}>
            {title}
          </Heading>
          <CloseButton borderRadius='xl' />
        </Flex>
        <ModalBody p={0} {...props}>
          {children}
        </ModalBody>
        {footer && (
          <ModalFooter>
            {footer}
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
