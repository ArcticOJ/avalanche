import {cpp} from '@codemirror/lang-cpp';
import {LanguageSupport, StreamLanguage} from '@codemirror/language';
import {pascal} from '@codemirror/legacy-modes/mode/pascal';
import {go} from '@codemirror/legacy-modes/mode/go';
import {python} from '@codemirror/lang-python';
import {Icon, IconBrandCpp, IconBrandGolang, IconBrandPython, IconCodeDots} from '@tabler/icons-react';
import {createElement} from 'react';

export const languages: Record<string, {
  name: string,
  type: keyof typeof languageTypes,
}> = {
  'gnuc++11': {
    name: 'GNU C++ 11',
    type: 'cpp'
  },
  'gnuc++14': {
    name: 'GNU C++ 14',
    type: 'cpp'
  },
  'gnuc++17': {
    name: 'GNU C++ 17',
    type: 'cpp'
  },
  'gnuc++20': {
    name: 'GNU C++ 20',
    type: 'cpp'
  },
  'python3': {
    name: 'Python 3',
    type: 'python'
  },
  'pypy3': {
    name: 'PyPy 3',
    type: 'python'
  },
  'pascal': {
    name: 'Free Pascal',
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

export const options = Object.entries(languages).map(([k, v]) => ({
  label: v.name,
  value: k,
  icon: createElement(languageTypes[v.type].icon, {
    size: 14
  })
}));