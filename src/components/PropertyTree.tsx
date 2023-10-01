import {Table, TableProps, Tbody, Td, Tr} from '@chakra-ui/react';
import type {ReactElement} from 'react';

interface PropertyTreeProps extends TableProps {
  properties: Record<string, string | number | ReactElement>;
}

export default function PropertyTree({properties, ...props}: PropertyTreeProps) {
  const entries = Object.entries(properties);
  return (
    <Table size='sm' {...props}>
      <Tbody sx={{
        'tr.css-0:last-child > td': {
          borderBottom: 'none'
        }
      }}>
        {entries.map(([label, value]) => (
          <Tr key={label}>
            <Td fontWeight='semibold'>
              {label}
            </Td>
            <Td isNumeric={typeof value === 'number'}>
              {value}
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
