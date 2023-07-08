import type {Icon} from '@tabler/icons-react';
import {createElement, useCallback, useEffect, useRef, useState} from 'react';
import {HStack, Kbd, Menu, MenuDivider, MenuItem, MenuList, useConst} from '@chakra-ui/react';
import {ensureClientSide} from 'lib/utils/common';

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
  const metaKey = useConst(ensureClientSide(() => /mac os x/i.test(navigator.userAgent) ? '⌘' : 'Ctrl'));
  const menuRef = useRef<HTMLDivElement>();
  const onContextMenu = useCallback(async (e: MouseEvent) => {
    e.preventDefault();
    const viewportRect = document.body.getBoundingClientRect();
    const menuRect = menuRef.current.getBoundingClientRect();
    setPos({
      x: Math.min(e.pageX, viewportRect.width - menuRect.width),
      y: Math.min(e.pageY, viewportRect.height - menuRect.height)
    });
    onToggle();
  }, []);
  useEffect(() => {
    if (!container) return;
    container.addEventListener('contextmenu', onContextMenu);
    return () => container.removeEventListener('contextmenu', onContextMenu);
  }, [container]);

  return (
    <Menu isOpen={isOpen} onClose={onClose}>
      <MenuList left={pos.x} top={pos.y} pos='fixed' ref={menuRef}>
        {children.map((item, i) => item.type === 'divider' ? (
          <MenuDivider key={i} />
        ) : (
          // @ts-ignore
          <MenuItem command={
            <HStack spacing={1}>
              {item.command.map(
                (cmd, i) => (
                  <Kbd key={i}>{(cmd === 'Ctrl' ? metaKey : cmd)}</Kbd>
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
  );
}
