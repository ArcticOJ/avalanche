import {useCallback, useMemo, useState} from 'react';
import throttle from 'lodash.throttle';
import {ensureClientSide} from 'lib/utils';
import {compress, decompress} from 'lzutf8';
import type {EditorState, StateField} from '@codemirror/state';
import {historyField} from '@codemirror/commands';

interface CacheHandler {
  save(state: EditorState): void;

  load(): Promise<{
    json: any,
    fields: Record<string, StateField<unknown>>;
  }>;
}

const stateFields = {history: historyField};

export default function useCodeCache(): CacheHandler {
  const storage = useMemo(ensureClientSide(() => localStorage), []);
  const save = useCallback(throttle((state: EditorState) => {
    storage.setItem('arctic:state', compress(JSON.stringify(state.toJSON(stateFields)), {
      outputEncoding: 'Base64'
    }));
  }, 2e3), []);
  const load = useCallback(async () => {
    const state = decompress(storage.getItem('arctic:state') || '', {
      inputEncoding: 'Base64',
      outputEncoding: 'String'
    });
    if (!state || state.length === 0)
      return {
        json: null,
        fields: null
      };
    return {
      json: JSON.parse(state),
      fields: stateFields
    };
  }, []);
  return {
    save,
    load
  };
}
