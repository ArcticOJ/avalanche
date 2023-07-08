import {Checkbox, CheckboxIconProps, CheckboxProps} from '@chakra-ui/react';
import {IconCheck, IconMinus} from '@tabler/icons-react';

function Checkmark({isIndeterminate, isChecked}: CheckboxIconProps) {
  return isChecked ? <IconCheck strokeWidth={2.125} /> : isIndeterminate ? <IconMinus strokeWidth={2.125} /> : <></>;
}

export default function CheckBox({value, ...props}: CheckboxProps) {
  return (
    // @ts-ignore
    <Checkbox icon={<Checkmark />} value={value} isChecked={value} {...props} />
  );
}
