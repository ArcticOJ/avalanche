import type {ModalContentProps, ModalFooter, ModalFooterProps} from '@chakra-ui/react';
import {CloseButton, Heading, HStack, Modal, ModalBody, ModalContent, ModalOverlay, Spacer} from '@chakra-ui/react';
import type {ReactElement} from 'react';

interface DialogProps extends ModalContentProps {
  header: string;
  size?: string;
  footer?: ReactElement<ModalFooterProps, typeof ModalFooter>;
  isOpen?: boolean;

  onClose();
}

export default function Dialog({header, size = 'md', footer, children, onClose, isOpen, ...props}: DialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size}>
      <ModalOverlay />
      <ModalContent borderRadius='xl' bg='gray.800' {...props}>
        <HStack align='center' mx={6} mt={4} mb={2}>
          <Heading as='h5' size='sm'>
            {header}
          </Heading>
          <Spacer />
          <CloseButton borderRadius='xl' onClick={onClose} />
        </HStack>
        <ModalBody>
          {children}
        </ModalBody>
        {footer}
      </ModalContent>
    </Modal>
  );
}
