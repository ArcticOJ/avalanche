import {Box, chakra, Flex, Heading, VStack} from '@chakra-ui/react';
import {Children, createElement, PropsWithChildren, ReactElement, useState} from 'react';
import {Icon} from '@tabler/icons-react';
import {transition} from 'lib/utils/common';
import {motion} from 'framer-motion';

const AnimatedDiv = chakra(motion.div);

export interface SegmentProps {
  icon: Icon;
  label: string;
}

export interface SegmentedControl {
  onItemSelected?: (index: number) => void;
  items: ReactElement[];
}

export function Segment({icon, label}: SegmentProps) {
  return (
    <VStack align='center' zIndex={100} pos='absolute' top={0} left={0} bottom={0} right={0} justify='center'>
      {createElement(icon, {
        size: 20
      })}
      <Heading size='xs'>
        {label}
      </Heading>
    </VStack>
  );
}

export function SegmentedControl({items, children}: PropsWithChildren<SegmentedControl>) {
  const [selected, setSelected] = useState(0);
  return (
    <VStack align='stretch'>
      <Flex p={2} h={20} bg='gray.900' borderRadius='xl' gap={2}>
        {items.map((segment, i) => (
          <Box {...transition(.25, ['color'])} onClick={() => setSelected(i)}
            color={selected !== i && 'gray.300'} key={i}
            pos='relative' h='100%' w='100%'
            cursor='pointer'>
            {selected === i && (
              <AnimatedDiv layoutId='100%' left={0} w='100%' top={0} h='100%' bg='gray.800'
                borderRadius='lg'
                pos='absolute' />
            )}
            {segment}
          </Box>
        ))}
      </Flex>
      {Children.map(children, (c, i) => (
        <div key={i} style={{
          display: selected !== i && 'none'
        }}>
          {c}
        </div>
      ))}
    </VStack>
  );
}
