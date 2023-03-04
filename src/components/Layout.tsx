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
  VStack
} from '@chakra-ui/react';
import {createElement, PropsWithChildren, Suspense, useMemo} from 'react';
import {
  Award,
  Book,
  Edit3, Feather,
  Home,
  Icon,
  LogOut,
  Send, Server,
  Settings,
  Shield,
  TrendingUp,
  User as UserIcon
} from 'react-feather';
import {motion} from 'framer-motion';
import {useRouter} from 'next/router';
import AuthModal from 'components/modals/Authenticate';
import {useAuth} from 'lib/hooks/useAuth';
import {User} from 'lib/types/users';
import NextLink from 'next/link';
import Gravatar from 'components/Gravatar';
import {usei18n} from 'lib/hooks/usei18n';
import {transition} from 'lib/utils';

interface Route {
  route: string;
  key: string;
  icon: Icon;
}

const routes: Route[] = [
  {
    icon: Feather,
    key: 'feeds',
    route: '/feeds'
  },
  {
    icon: TrendingUp,
    key: 'leaderboard',
    route: '/leaderboard'
  },
  {
    icon: Award,
    key: 'contests',
    route: '/contests'
  },
  {
    icon: Edit3,
    key: 'problems',
    route: '/problems'
  },
  {
    icon: Send,
    key: 'submissions',
    route: '/submissions'
  },
  {
    icon: Server,
    key: 'server',
    route: '/server'
  }
];

const adminRoute: Route = {
  route: '/admin',
  key: 'adminpanel',
  icon: Shield
};

const AnimatedDiv = chakra(motion.div);

function InnerLayout({children}: PropsWithChildren) {
  const {route} = useRouter();
  return route.startsWith('/admin') ? (
    <Flex h='100%' bg='gray.700' borderTopLeftRadius='2xl'>
      <VStack h='100%' p={2}>
        <NavigationItem id='adminTabIndicator' shade={-100} collapsed={false} isCurrent route={{
          route: '/admin/config',
          key: 'Configuration',
          icon: Settings
        }} />
        <NavigationItem id='adminTabIndicator' shade={-100} collapsed={false} isCurrent={false} route={{
          route: '/admin/contests',
          key: 'contests',
          icon: Book
        }} />
      </VStack>
      {children}
    </Flex>
  ) : (
    <>
      {children}
    </>
  );
}

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
  const label = useMemo(() => t(`routes.${route.key}`), [t]);
  const colorMap = useMemo(() => {
    if (isCurrent)
      return {
        fg: 'black'
      };
    return {
      fg: 'white'
    };
  }, [isCurrent]);
  return (
    <Container p={0} pos='relative' minW={12}>
      {isCurrent && (
        <AnimatedDiv
          position='absolute'
          m={0} borderRadius='xl'
          bg={`${color}.200`}
          w='100%'
          h='100%'
          key={route.route}
          layoutId={id}
        />
      )}
      <Tooltip label={label} placement='right' isDisabled={!collapsed}>
        <NextLink href={route.route}>
          <chakra.button
            _hover={{
              bg: `gray.${700 + shade}`
            }} _active={{
              bg: `gray.${600 + shade}`
            }}
            transition={transition(0.25)}
            color={colorMap.fg}
            borderRadius='xl'
            h={10} w='100%'>
            <HStack px={4} spacing={4} align='center' justify={collapsed && 'center'} position='relative'>
              {createElement(route.icon, {
                size: 16
              })}
              {!collapsed && (
                <Heading fontSize={14} fontWeight={600}>
                  {label}
                </Heading>
              )}
            </HStack>
          </chakra.button>
        </NextLink>
      </Tooltip>
    </Container>
  );
}

function UserInfo({collapsed, user, onLogOut}: { collapsed: boolean, user: User, onLogOut: () => Promise<void> }) {
  const {currentLanguage, switchLanguage, t} = usei18n();
  return (
    <Menu size='sm'>
      <MenuButton as={Button} variant='ghost' py={collapsed ? 6 : 8}
        transition={transition()}
        borderRadius='2xl'
        px={collapsed ? 2 : 4}>
        <HStack spacing={2}>
          <Gravatar colorScheme='arctic' email={user.email} name={user.handle} />
          <VStack spacing={0} textAlign='start' display={collapsed && 'none'}>
            <Text fontSize={15} color='white'>
              {user.handle}
            </Text>
            <Text fontSize={10}>
              {user.displayName}
            </Text>
          </VStack>
        </HStack>
      </MenuButton>
      <MenuList>
        <MenuItem as={NextLink} href='/profile'
          icon={<UserIcon size={16} />}>{t('sidebar.usermenu.yourprofile')}</MenuItem>
        <MenuItem icon={<Settings size={16} />}>{t('sidebar.usermenu.userprefs')}</MenuItem>
        <MenuItem icon={<Image alt={currentLanguage} src={`/static/flags/${currentLanguage}.png`} boxSize={4} />}
          onClick={switchLanguage}>
          {t('sidebar.usermenu.lang', {
            lang: t(`language.${currentLanguage}`)
          })}
        </MenuItem>
        <MenuDivider />
        <MenuItem icon={<LogOut size={16} />} color='red.500' onClick={onLogOut}>{t('auth.logout')}</MenuItem>
      </MenuList>
    </Menu>
  );
}

function renderRoutes(routes: Route[], currentRoute: string, collapsed: boolean) {
  return useMemo(() => routes.map(r => (
    <NavigationItem key={r.route} route={r} isCurrent={r.route === currentRoute}
      collapsed={collapsed} />
  )), [currentRoute, collapsed]);
}

function AuthModalOpener({collapsed}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {t} = usei18n();
  return (
    <>
      <AuthModal isOpen={isOpen} onClose={onClose} />
      <Tooltip isDisabled={!collapsed} label={
        <div>
          <p>
            {t('auth.notloggedin')}
          </p>
          <p>
            Click to authenticate.
          </p>
        </div>
      }>
        <Button variant='ghost' h={collapsed ? 12 : 14} onClick={onOpen}>
          <HStack>
            <Avatar boxSize={collapsed ? 6 : 10}
              src='https://preview.redd.it/kh4mmq39qe581.png?width=256&format=png&auto=webp&s=185292a8a3bf2b8d8cfc9ba53e954dc0f128ef60' />
            {!collapsed && (
              <VStack spacing={0} align='start'>
                <Text color='white' fontSize={14}>
                  {t('auth.notloggedin')}
                </Text>
                <Text fontSize={11}>
                  Click to login
                </Text>
              </VStack>
            )}
          </HStack>
        </Button>
      </Tooltip>
    </>
  );
}

function Sidebar() {
  const {isLoggedIn, user, logout} = useAuth();
  const {pathname, asPath} = useRouter();
  const {isOpen, onToggle} = useDisclosure({
    defaultIsOpen: true
  });
  const currentRoute = useMemo(() => pathname.replaceAll(/\/\[.+]/ig, ''), [pathname, asPath]);
  return (
    <AnimatedDiv p={2} h='100vh' display='flex' flexDir='column' gap={2} animate={{
      minWidth: isOpen ? 192 : 0
    }}>
      <HStack alignSelf='center'>
        <Tooltip label={isOpen ? 'Collapse' : 'Expand'} placement='right'>
          <IconButton variant='ghost' w='100%' size='md' onClick={onToggle}
            aria-label={isOpen ? 'Collapse' : 'Expand'}>
            <Image src='/static/favicon.png' alt='Arctic'
              boxSize='32px' />
          </IconButton>
        </Tooltip>
        <Heading size='md' display={!isOpen && 'none'}>Arctic</Heading>
        <Spacer display={!isOpen && 'none'} />
      </HStack>
      <Divider />
      {renderRoutes(routes, currentRoute, !isOpen)}
      <NavigationItem route={adminRoute} isCurrent={currentRoute.startsWith('/admin')}
        collapsed={!isOpen} color='red' />
      <Spacer />
      <Text>
      </Text>
      <Divider />
      {isLoggedIn ? (
        <UserInfo collapsed={!isOpen} user={user} onLogOut={logout} />
      ) : (
        <AuthModalOpener collapsed={!isOpen} />
      )}
    </AnimatedDiv>
  );
}

export default function Layout({children}) {
  return (
    <Flex w='100vw' h='100vh' bg='gray.800'>
      <Sidebar />
      <InnerLayout>
        <Box m={0} bg='gray.900' borderTopLeftRadius='2xl' flex={1} h='100%'>
          <Suspense>
            {children}
          </Suspense>
        </Box>
      </InnerLayout>
    </Flex>
  );
}
