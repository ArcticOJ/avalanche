import {Box, CloseButton, Flex, Slide, VStack} from '@chakra-ui/react';
import TextBox, {TextBoxButton} from 'components/TextBox';
import {ChevronDown, RefreshCw, Search} from 'react-feather';
import useDebouncedValue from 'lib/hooks/useDebouncedValue';
import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import type {ReactCodeMirrorRef} from '@uiw/react-codemirror';
import {StateEffect} from '@codemirror/state';
import {SearchQuery} from '@codemirror/search';

const setSearchQuery = StateEffect.define<SearchQuery>();

export default function SearchPanel({editorRef}: {
  editorRef: MutableRefObject<ReactCodeMirrorRef>
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
    const query = new SearchQuery({
      search: debouncedValue,
      caseSensitive: false,
      regexp: false,
      wholeWord: false,
      replace: ''
    });
    if (query.eq(currentQuery.current) || editorRef.current.view == null) return;
    console.log(query);
    editorRef.current.view.dispatch({
      effects: setSearchQuery.of(query)
    });
    currentQuery.current = query;
  }, [debouncedValue]);
  return (
    <Slide in={false} direction='right'>
      <Box borderRadius='xl' bg='gray.800' p={2} position='absolute' top={4} right={0} zIndex={101} shadow='md'>
        <Flex gap={2}>
          <VStack flex={1}>
            <TextBox placeholder='Find' onChange={e => {
              console.log(e);
              setValue(e.target.value);
            }} icon={Search}
            value={value}
            rightElement={<TextBoxButton aria-label='Next occurrence' borderRadius={11} icon={ChevronDown}
              variant='ghost'
              h='24px' />} />
            <TextBox placeholder='Replace' icon={RefreshCw} />
          </VStack>
          <CloseButton borderRadius='xl' />
        </Flex>
      </Box>
    </Slide>
  );
}
