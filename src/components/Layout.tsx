import {
  Avatar,
  Box,
  Button,
  chakra,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
  useMediaQuery,
  VStack
} from '@chakra-ui/react';
import {createElement, lazy, startTransition, useState} from 'react';
import IconLeaderboard from 'components/icons/Leaderboard';
import {
  Icon,
  IconBinaryTree,
  IconChevronsLeft,
  IconChevronsRight,
  IconLogin,
  IconLogout,
  IconNews,
  IconSend,
  IconSettings,
  IconTrophy,
  IconUser
} from '@tabler/icons-react';
import {usePathname} from 'next/navigation';
import {useAuth} from 'lib/hooks/useAuth';
import NextLink from 'next/link';
import Gravatar from 'components/Gravatar';
import {usei18n} from 'lib/hooks/usei18n';
import {transition} from 'lib/utils/common';
import {motion} from 'framer-motion';
import {brandName} from 'lib/branding';

const AuthModal = lazy(() => import('components/modals/Authenticate'));

const PrefModal = lazy(() => import('components/modals/Preferences'));

interface Route {
  route: string;
  key: string;
  icon: Icon;
}


// TODO: tree-shake motion bundle
const
  routes: Route[] = [
    {
      icon: IconNews,
      key: 'feeds',
      route: '/feeds'
    },
    {
      icon: IconLeaderboard,
      key: 'leaderboard',
      route: '/leaderboard'
    },
    {
      icon: IconTrophy,
      key: 'contests',
      route: '/contests'
    },
    {
      icon: IconBinaryTree,
      key: 'problems',
      route: '/problems'
    },
    {
      icon: IconSend,
      key: 'submissions',
      route: '/submissions'
    }
  ],
  AnimatedDiv = chakra(motion.div);

export function NavigationItem({
  route,
  isCurrent,
  collapsed,
  shade = 0,
  id = 'tabIndicator',
  color = 'arctic'
}: {
  route: Route,
  isCurrent: boolean,
  collapsed: boolean,
  shade?: number,
  id?: string,
  color?: 'arctic' | 'red'
}) {
  const {t} = usei18n();
  const label = t(`routes.${route.key}`);
  const colorMap = {
    fg: isCurrent ? 'black' : 'gray.50'
  };
  return (
    <Container p={0} pos='relative' minW={12}>
      {isCurrent && (
        <AnimatedDiv
          position='absolute'
          m={0} borderRadius='2xl'
          bg={`${color}.200`}
          w='100%'
          h='100%'
          layoutId={id}
        />
      )}
      <Tooltip hasArrow label={label} placement='right' isDisabled={!collapsed}>
        <NextLink href={route.route as any}>
          <chakra.button
            _hover={{
              bg: `gray.${700 + shade}`
            }} _active={{
              bg: `gray.${600 + shade}`
            }}
            borderRadius='2xl'
            {...transition(.25, ['background'])}
            h={10} w='100%'>
            <HStack
              px={4}
              spacing={4}
              align='center'
              justify={collapsed ? 'center' : 'start'}
              position='relative'
              color={colorMap.fg}
              transitionDelay='.1s'
              {...transition(.25, ['color'])}>
              {createElement(route.icon, {
                size: 18
              })}
              <Text fontSize='sm' fontWeight='semibold' display={collapsed ? 'none' : 'block'}>
                {label}
              </Text>
            </HStack>
          </chakra.button>
        </NextLink>
      </Tooltip>
    </Container>
  );
}

function UserInfo({collapsed, user, onLogOut, isLoggedIn}) {
  const {currentLanguage, switchLanguage, t} = usei18n();
  const [openedModal, setOpenedModal] = useState<'auth' | 'pref' | ''>('');
  return (
    <>
      <AuthModal isOpen={openedModal === 'auth'} onClose={() => setOpenedModal('')} />
      <PrefModal isOpen={openedModal === 'pref'} onClose={() => setOpenedModal('')} />
      <Menu size='sm'>
        <MenuButton as={Button} variant='ghost' py={collapsed ? 6 : 8}
          {...transition(.2, ['background', 'width', 'height'])}
          borderRadius='2xl'
          px={collapsed ? 2 : 4}>
          <HStack spacing={2}>
            {isLoggedIn ? (
              <>
                <Gravatar colorScheme='arctic' email={user.email} name={user.handle} />
                <VStack spacing={0} textAlign='start' display={collapsed && 'none'}>
                  <Text fontSize={15} color='gray.50'>
                    {user.handle}
                  </Text>
                  <Text fontSize={10}>
                    {user.displayName}
                  </Text>
                </VStack>
              </>
            ) : (
              <>
                <Avatar boxSize={8}
                  src='https://preview.redd.it/kh4mmq39qe581.png?width=256&format=png&auto=webp&s=185292a8a3bf2b8d8cfc9ba53e954dc0f128ef60' />
                <VStack display={collapsed ? 'none' : 'block'}>
                  <Text color='gray.50'>
                    {t('auth.notLoggedIn')}
                  </Text>
                </VStack>
              </>
            )}
          </HStack>
        </MenuButton>
        <MenuList>
          {isLoggedIn ? (
            // avoid prefetching unneeded page
            <MenuItem as={NextLink} href={isLoggedIn ? `/profile/${user.handle}` : null}
              icon={<IconUser size={16} />}>{t('sidebar.userMenu.yourProfile')}</MenuItem>
          ) : (
            <>
              <MenuItem icon={<IconLogin size={16} />} as={Button}
                onClick={() => setOpenedModal('auth')}>{t('auth.log2arctic')}</MenuItem>
              <MenuDivider />
            </>
          )}
          <MenuItem icon={<IconSettings size={16} />}
            onClick={() => setOpenedModal('pref')}>{t('sidebar.userMenu.userPrefs')}</MenuItem>
          <MenuItem icon={<Image alt={currentLanguage} src={`/static/flags/${currentLanguage}.svg`} boxSize={4} />}
            onClick={switchLanguage}>
            {t('sidebar.userMenu.lang', {
              lang: t(`language.${currentLanguage}`)
            })}
          </MenuItem>
          {isLoggedIn && (
            <>
              <MenuDivider />
              <MenuItem icon={<IconLogout size={16} />} color='red.500' onClick={onLogOut}>{t('auth.logout')}</MenuItem>
            </>
          )}
        </MenuList>
      </Menu>
    </>
  );
}

function renderRoutes(routes: Route[], currentRoute: string, collapsed: boolean) {
  return routes.map(r => (
    <NavigationItem key={r.route} route={r} isCurrent={r.route === currentRoute}
      collapsed={collapsed} />
  ));
}

function getRootRoute(path?: string): string {
  if (!path)
    return '';
  if (path.startsWith('/'))
    path = path.substring(1);
  return '/' + path.split('/').shift();
}

function Sidebar() {
  const {isLoggedIn, user, logout} = useAuth();
  const pathname = usePathname();
  const {isOpen, onToggle} = useDisclosure({
    defaultIsOpen: true
  });
  const currentRoute = getRootRoute(pathname);
  const [isMobile, isSmallScreen] = useMediaQuery([
    '(min-width: 1920px)',
    '(display-mode: browser)'
  ]);
  return (
    <Box as='aside' p={2} h='100vh' display='flex' flexDir='column' gap={2}
      {...transition(.2, ['width'])} w={isOpen ? 52 : 16}>
      <HStack alignSelf='center'>
        <Image src='/static/favicon.png' alt={brandName}
          boxSize={8} />
        <Heading size='md' display={!isOpen ? 'none' : ''}>{brandName}</Heading>
        <Spacer display={!isOpen ? 'none' : ''} />
      </HStack>
      <Divider />
      {renderRoutes(routes, currentRoute, !isOpen)}
      <Spacer />
      <Tooltip hasArrow label='Expand' isDisabled={isOpen} placement='right'>
        {isOpen ? (
          <Button variant='ghost' w='100%' onClick={() => startTransition(onToggle)}
            leftIcon={<IconChevronsLeft size={16} />}>
            Collapse
          </Button>
        ) : (
          <IconButton variant='ghost' size='md' aria-label='Expand' onClick={() => startTransition(onToggle)}>
            <IconChevronsRight size={16} />
          </IconButton>
        )}
      </Tooltip>
      <Divider />
      <UserInfo isLoggedIn={isLoggedIn} collapsed={!isOpen} user={user} onLogOut={logout} />
    </Box>
  );
}

export default function Layout({children}) {
  return (
    <Flex w='100%' h='100vh' bg='gray.800'>
      <Sidebar />
      <Box m={0} bg='gray.900' borderTopLeftRadius='2xl' flex={1} h='100%' as='main' overflow='auto'>
        {children}
      </Box>
    </Flex>
  );
}
