import {
  CloseButton,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalBodyProps,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalProps
} from '@chakra-ui/react';
import {ReactNode} from 'react';

interface BaseModalProps extends ModalProps {
  isOpen: boolean;
  title: string;
  footer?: ReactNode;
  bodyProps?: ModalBodyProps;

  onClose(): void;

}

export default function BaseModal({isOpen, onClose, title, children, footer, bodyProps, ...props}: BaseModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size='sm'  {...props}>
      <ModalOverlay />
      <ModalContent bg='gray.800' borderRadius='xl'>
        <Flex alignItems='center' my={4} mx={6}>
          <Heading fontWeight={700} fontSize='lg' flex={1}>
            {title}
          </Heading>
          <CloseButton borderRadius='xl' onClick={onClose} />
        </Flex>
        <ModalBody p={0} {...bodyProps}>
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
