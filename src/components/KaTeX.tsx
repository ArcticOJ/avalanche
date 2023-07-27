// TODO: handle formula errors
import {PropsWithChildren, useEffect, useRef} from 'react';
import renderMathInElement from 'katex/dist/contrib/auto-render.min.js';
import {Text, TextProps} from '@chakra-ui/react';

export default function KaTeX({children, ...props}: TextProps) {
  const ref = useRef();
  useEffect(() => {
    renderMathInElement(ref.current, {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false}
      ]
    });
  }, [children]);
  return (
    <Text as='span' {...props} ref={ref}>
      {children}
    </Text>
  );
}