import ContextMenu, {ContextMenuDivider, ContextMenuItem} from 'components/ContextMenu';
import {createElement, ReactElement, useState} from 'react';
import {useDisclosure} from '@chakra-ui/react';

interface ContextMenuHandler {
  menu: ReactElement;

  bind(element: HTMLElement): void;
}

export default function useContextMenu(items: Array<ContextMenuItem | ContextMenuDivider>): ContextMenuHandler {
  const [container, setContainer] = useState<HTMLElement>();
  const {isOpen, onClose, onToggle} = useDisclosure();
  return {
    bind(element) {
      setContainer(element);
    },
    // eslint-disable-next-line react/no-children-prop
    menu: createElement(ContextMenu, {
      isOpen,
      onClose,
      onToggle,
      container,
      children: items
    })
  };
}
