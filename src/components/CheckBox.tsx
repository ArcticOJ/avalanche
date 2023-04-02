import {Checkbox, CheckboxIconProps, CheckboxProps} from '@chakra-ui/react';
import {Check, Minus} from 'react-feather';

function Checkmark({isIndeterminate, isChecked}: CheckboxIconProps) {
  return isChecked ? <Check /> : isIndeterminate ? <Minus /> : <></>;
}

export default function CheckBox({value, ...props}: CheckboxProps) {
  console.log(value);
  return (
    // @ts-ignore
    <Checkbox icon={<Checkmark />} value={value} isChecked={value} {...props} />
  );
}
