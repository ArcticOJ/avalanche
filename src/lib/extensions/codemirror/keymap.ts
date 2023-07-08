import {KeyBinding, keymap} from '@codemirror/view';
import {Extension} from '@codemirror/state';

export default function arcticKeymap(onSearch: (close: boolean) => void): Extension {
  const map: ReadonlyArray<KeyBinding> = [
    {
      key: 'Ctrl-f',
      run: () => {
        onSearch(false);
        return true;
      }
    }
  ];
  return keymap.of(map);
}