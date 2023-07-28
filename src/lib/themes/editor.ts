import {tags as t} from '@lezer/highlight';
import {createTheme} from '@uiw/codemirror-themes';
import {inconsolata} from 'lib/themes/fonts';

export default createTheme({
  theme: 'dark',
  settings: {
    fontFamily: inconsolata,
    background: 'var(--chakra-colors-gray-900)',
    foreground: '#FFFFFF',
    caret: '#FFFFFF',
    selection: 'var(--chakra-colors-arctic-700)',
    selectionMatch: '#e5e9f0',
    gutterBackground: 'var(--chakra-colors-gray-900)',
    gutterForeground: '#4c566a',
    gutterActiveForeground: '#d8dee9',
    lineHighlight: 'var(--chakra-colors-gray-800)'
  },
  styles: [
    {tag: t.keyword, color: '#5e81ac'},
    {
      tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
      color: '#88c0d0'
    },
    {tag: [t.variableName], color: '#8fbcbb'},
    {tag: [t.function(t.variableName)], color: '#8fbcbb'},
    {tag: [t.labelName], color: '#81a1c1'},
    {
      tag: [t.color, t.constant(t.name), t.standard(t.name)],
      color: '#5e81ac'
    },
    {tag: [t.definition(t.name), t.separator], color: '#a3be8c'},
    {tag: [t.brace], color: '#8fbcbb'},
    {
      tag: [t.annotation],
      color: '#d30102'
    },
    {
      tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
      color: '#b48ead'
    },
    {
      tag: [t.typeName, t.className],
      color: '#ebcb8b'
    },
    {
      tag: [t.operator, t.operatorKeyword],
      color: '#a3be8c'
    },
    {
      tag: [t.tagName],
      color: '#b48ead'
    },
    {
      tag: [t.squareBracket],
      color: '#bf616a'
    },
    {
      tag: [t.angleBracket],
      color: '#d08770'
    },
    {
      tag: [t.attributeName],
      color: '#ebcb8b'
    },
    {
      tag: [t.regexp],
      color: '#5e81ac'
    },
    {
      tag: [t.quote],
      color: '#b48ead'
    },
    {tag: [t.string], color: '#a3be8c'},
    {
      tag: t.link,
      color: '#a3be8c',
      textDecoration: 'underline',
      textUnderlinePosition: 'under'
    },
    {
      tag: [t.url, t.escape, t.special(t.string)],
      color: '#8fbcbb'
    },
    {tag: [t.meta], color: '#88c0d0'},
    {tag: [t.monospace], color: '#d8dee9', fontStyle: 'italic'},
    {tag: [t.comment], color: '#4c566a', fontStyle: 'italic'},
    {tag: t.strong, fontWeight: 'bold', color: '#5e81ac'},
    {tag: t.emphasis, fontStyle: 'italic', color: '#5e81ac'},
    {tag: t.strikethrough, textDecoration: 'line-through'},
    {tag: t.heading, fontWeight: 'bold', color: '#5e81ac'},
    {tag: t.special(t.heading1), fontWeight: 'bold', color: '#5e81ac'},
    {tag: t.heading1, fontWeight: 'bold', color: '#5e81ac'},
    {
      tag: [t.heading2, t.heading3, t.heading4],
      fontWeight: 'bold',
      color: '#5e81ac'
    },
    {
      tag: [t.heading5, t.heading6],
      color: '#5e81ac'
    },
    {tag: [t.atom, t.bool, t.special(t.variableName)], color: '#d08770'},
    {
      tag: [t.processingInstruction, t.inserted],
      color: '#8fbcbb'
    },
    {
      tag: [t.contentSeparator],
      color: '#ebcb8b'
    },
    {tag: t.invalid, color: '#434c5e', borderBottom: '1px dotted #d30102'}
  ]
});
