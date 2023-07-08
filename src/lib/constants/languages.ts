import {cpp} from '@codemirror/lang-cpp';
import {LanguageSupport, StreamLanguage} from '@codemirror/language';
import {pascal} from '@codemirror/legacy-modes/mode/pascal';
import {go} from '@codemirror/legacy-modes/mode/go';
import {python} from '@codemirror/lang-python';
import {Icon, IconBrandCpp, IconBrandGolang, IconBrandPython, IconCodeDots} from '@tabler/icons-react';

export const languages: Record<string, {
  name: string,
  type: keyof typeof languageTypes,
}> = {
  'py3': {
    name: 'Python 3',
    type: 'python'
  },
  //'c++98': 'LLVM C++ 98',
  'gnu++11': {
    name: 'GNU C++ 11',
    type: 'cpp'
  },
  'gnu++14': {
    name: 'GNU C++ 14',
    type: 'cpp'
  },
  'gnu++17': {
    name: 'GNU C++ 17',
    type: 'cpp'
  },
  'gnu++2a': {
    name: 'GNU C++ 20',
    type: 'cpp'
  },
  'pas': {
    name: 'Pascal',
    type: 'pascal'
  },
  'golang': {
    name: 'Go',
    type: 'golang'
  }
};

export const languageTypes: Record<string, {
  icon: Icon,
  ext: () => LanguageSupport | StreamLanguage<unknown>
}> = {
  'cpp': {
    icon: IconBrandCpp,
    ext: cpp
  },
  'pascal': {
    icon: IconCodeDots,
    ext: () => StreamLanguage.define(pascal)
  },
  'python': {
    icon: IconBrandPython,
    ext: python
  },
  'golang': {
    icon: IconBrandGolang,
    ext: () => StreamLanguage.define(go)
  }
};