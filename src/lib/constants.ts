import {cpp} from '@codemirror/lang-cpp';
import {pascal} from '@codemirror/legacy-modes/mode/pascal';
import {StreamLanguage} from '@codemirror/language';
import {python} from '@codemirror/lang-python';

export const languages = {
  'py3': 'Python 3',
  //'c++98': 'LLVM C++ 98',
  'gnu++11': 'GNU C++ 11',
  'gnu++14': 'GNU C++ 14',
  'gnu++17': 'GNU C++ 17',
  'pas': 'Pascal'
};

export const editorLanguages = {
  'cpp': ['gnu++11', 'gnu++14', 'gnu++17'],
  'python': ['py3'],
  'pascal': ['pas']
};

export const languageDefinitions = {
  'cpp': () => cpp(),
  'pascal': () => StreamLanguage.define(pascal),
  'python': () => python()
};

export const noop = () => {
};

export const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
