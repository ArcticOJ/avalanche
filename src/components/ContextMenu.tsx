import type {Icon} from 'react-feather';
import {createElement, useEffect, useState} from 'react';
import {HStack, Kbd, Menu, MenuDivider, MenuItem, MenuList, Portal} from '@chakra-ui/react';
import {ensureClientSide} from 'lib/utils';

interface ContextMenuProps {
  isOpen: boolean;
  children?: Array<ContextMenuItem | ContextMenuDivider>;
  container: HTMLElement;

  onClose(): void;

  onToggle(): void;
}

export interface ContextMenuItem {
  type?: 'item';
  label: string;
  icon: Icon;
  command: Array<string>;

  action();
}

export interface ContextMenuDivider {
  type: 'divider';
}

export default function ContextMenu({isOpen, onClose, onToggle, container, children}: ContextMenuProps) {
  const [pos, setPos] = useState({x: 0, y: 0});
  const onContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    setPos({x: e.pageX, y: e.pageY});
    onToggle();
  };
  useEffect(() => {
    if (!container) return;
    container.addEventListener('contextmenu', onContextMenu);
    return () => container.removeEventListener('contextmenu', onContextMenu);
  }, [container]);
  return (
    <Portal>
      <Menu isOpen={isOpen} onClose={onClose}>
        <MenuList left={pos.x} top={pos.y} pos='absolute'>
          {children.map((item, i) => item.type === 'divider' ? (
            <MenuDivider key={i} />
          ) : (
            // @ts-ignore
            <MenuItem command={
              <HStack spacing={1}>
                {item.command.map(
                  (cmd, i) => (
                    <Kbd key={i}>{(cmd === 'Ctrl' ? (
                      ensureClientSide(() => /mac os x/i.test(navigator.userAgent))() ? '⌘' : 'Ctrl'
                    ) : cmd)}</Kbd>
                  ))
                }
              </HStack>
            }
            onClick={item.action}
            key={i}
            icon={createElement(item.icon, {
              size: 16
            })}>
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Portal>
  );
}
