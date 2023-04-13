import BaseModal from 'components/modals/BaseModal';
import {Divider, Flex, Switch, Text} from '@chakra-ui/react';

export default function Preferences() {
  return (
    <BaseModal isOpen={false} title='Preferences' bodyProps={{
      px: 6,
      py: 4
    }} onClose={() => {
    }}>
      <Flex alignItems='center'>
        <Text flex={1} fontWeight='semibold' fontSize='sm'>
          Dark mode
        </Text>
        <Switch />
      </Flex>
      <Divider my={2} />
    </BaseModal>
  );
}
