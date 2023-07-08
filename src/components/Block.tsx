import styles from 'styles/Block.module.scss';
import {Center, Image, Text} from '@chakra-ui/react';

export default function Block() {
  return (
    <Center w='100%' h={16} shadow='md' className={styles.container} gap={2}>
      <Image src='/static/favicon.png' alt='Arctic' boxSize={10} />
      <Text fontWeight='semibold' fontSize='md' mixBlendMode='screen'>Arctic status</Text>
    </Center>
  );
}
