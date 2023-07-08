import {Box, CloseButton, Flex, VStack} from '@chakra-ui/react';
import TextBox, {TextBoxButton} from 'components/TextBox';
import {IconChevronDown, IconChevronUp, IconRefresh, IconSearch} from '@tabler/icons-react';
import useDebouncedValue from 'lib/hooks/useDebouncedValue';
import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import type {ReactCodeMirrorRef} from '@uiw/react-codemirror';
import {StateEffect} from '@codemirror/state';
import {SearchQuery} from '@codemirror/search';

const setSearchQuery = StateEffect.define<SearchQuery>();

export default function SearchPanel({editorRef, onClose, isOpen}: {
  editorRef: MutableRefObject<ReactCodeMirrorRef>,
  onClose: () => void,
  isOpen: boolean
}) {
  // TODO: attach onChange method to update query, use useEditorSearch hook
  /*
  onViewUpdate:
    for (let tr of update.transactions) for (let effect of tr.effects) {
      if (effect.is(setSearchQuery) && !effect.value.eq(this.query)) this.setQuery(effect.value)
    }
   */
  const [value, setValue] = useState('');
  const {debouncedValue, commit} = useDebouncedValue(value, 100);
  const currentQuery = useRef<SearchQuery>({} as SearchQuery);
  useEffect(() => {
    if (!editorRef.current?.view)
      return;
    const query = new SearchQuery({
      search: debouncedValue,
      caseSensitive: false,
      regexp: false,
      wholeWord: false,
      replace: ''
    });
    if (query.eq(currentQuery.current) || editorRef.current.view === null) return;
    editorRef.current.view.dispatch({
      effects: setSearchQuery.of(query)
    });
    currentQuery.current = query;
  }, [debouncedValue]);
  return (
    isOpen &&
    <Box borderRadius='xl' bg='gray.800' p={2} position='absolute' top={4} right={0} zIndex={101} shadow='md'>
      <Flex gap={2}>
        <VStack flex={1}>
          <TextBox placeholder='Find' onChange={e => {
            setValue(e.target.value);
          }} icon={IconSearch}
          value={value}
          rightElement={
            <>
              <TextBoxButton aria-label='Previous occurrence' borderRadius={11} icon={IconChevronUp}
                variant='ghost'
                h='24px' />
              <TextBoxButton aria-label='Next occurrence' borderRadius={11} icon={IconChevronDown}
                variant='ghost'
                h='24px' />
            </>
          } />
          <TextBox placeholder='Replace' icon={IconRefresh} />
        </VStack>
        <CloseButton borderRadius='xl' onClick={onClose} />
      </Flex>
    </Box>
  );
}
