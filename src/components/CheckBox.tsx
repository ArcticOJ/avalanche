import {Checkbox, CheckboxIconProps, CheckboxProps} from '@chakra-ui/react';
import {Check, Minus} from 'react-feather';

function Checkmark({isIndeterminate, isChecked}: CheckboxIconProps) {
  return isChecked ? <Check /> : isIndeterminate ? <Minus /> : <></>;
}

export default function CheckBox(props: CheckboxProps) {
  return (
    <Checkbox icon={<Checkmark />} {...props} />
  );
}
