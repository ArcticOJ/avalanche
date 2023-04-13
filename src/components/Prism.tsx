import Highlight, {defaultProps, Language} from 'prism-react-renderer';
import theme from 'prism-react-renderer/themes/vsDark';
import {CSSProperties, useEffect, useState} from 'react';
import {classes} from 'lib/utils/common';
import prism from 'styles/Prism.module.scss';

interface PrismProps {
  withLineNumber?: boolean;
  code: string | Promise<string>;
  language: string;
  containerStyle?: CSSProperties;
}

export default function Prism({withLineNumber, code, language, containerStyle = {}}: PrismProps) {
  const [_code, setCode] = useState('');
  useEffect(() => {
    if (typeof code === 'string')
      setCode(code);
    else
      code.then(setCode);
  }, [code]);
  return (
    <Highlight {...defaultProps} code={_code}
      language={language as Language} theme={theme}>
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <pre className={classes(className, prism.prism)} style={{
          ...style,
          ...containerStyle
        }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({line})}>
              {withLineNumber && (
                <span className={prism.lineNumber}>{i + 1}</span>
              )}
              <span className={prism.lineContent}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({token})} />
                ))}
              </span>
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
