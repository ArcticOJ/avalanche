import {
  Box, BoxProps,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Progress,
  Skeleton,
  SkeletonText,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  VStack, Wrap
} from '@chakra-ui/react';
import {
  IconAbacus,
  IconActivity,
  IconAward,
  IconBadgesFilled,
  IconBuilding,
  IconCalendar,
  IconChartHistogram,
  IconClock,
  IconInfoCircle,
  IconUserEdit,
  IconUsersGroup
} from '@tabler/icons-react';
import NextLink from 'next/link';
import Gravatar from 'components/Gravatar';
import Section from 'components/Section';
import React, {createElement, lazy, Suspense, useEffect, useState, useTransition} from 'react';
import {TabItem} from 'components/TabItem';
import HeatMap from 'components/heatmap/HeatMap';
import Discord from 'components/icons/Discord';
import {Repeat} from 'immutable';
import dayjs from 'dayjs';
import ChakraSelect from 'components/ChakraSelect';
import GitHub from 'components/icons/GitHub';
import useClock from 'lib/hooks/useClock';
import {resolveRatingColor} from 'lib/utils/rating';
import {useAuth} from 'lib/hooks/useAuth';
import useFetch from 'lib/hooks/useFetch';
import useQuery from 'lib/hooks/useQuery';
import _404 from '../_404';
import LoadingOverlay from 'components/LoadingOverlay';
import {resolveProvider} from 'lib/oauth/resolver';
import {useRouter} from 'next/router';

const Markdown = lazy(() => import('components/Markdown'));

const RatingChart = lazy(() => import('components/RatingChart'));

function TextItem({label, icon, children}) {
  return (
    <HStack color='arctic.200'>
      <Tooltip hasArrow label={label} placement='left'>
        {createElement(icon, {
          size: 16
        })}
      </Tooltip>
      <Text fontWeight={600} fontSize='sm' color='gray.50'>
        {children}
      </Text>
    </HStack>
  );
}

function ConnectionItem({provider, username}) {
  const prov = resolveProvider(provider);
  return (
    <TextItem label={prov.name} icon={prov.icon}>
      {username}
    </TextItem>
  );
}

function getYearRange(a: Date, b: Date): number[] {
  const
    y1 = a.getFullYear(),
    y2 = b.getFullYear(),
    startYear = Math.min(y1, y2),
    endYear = Math.max(y1, y2);
  return Array.from({length: endYear - startYear + 1}, (_, i) => startYear + i);
}

function Block({children, ...props}: BoxProps) {
  return (
    <Box bg='gray.800' borderRadius='xl' shadow='md' w='100%' py={2} px={4} textAlign='left' {...props} fontSize='sm'
      fontWeight='semibold'>
      {children}
    </Box>
  );
}

export default function ProfilePage() {
  const {user: currentUser} = useAuth();
  const handle = useQuery('handle');
  const {data: user, error} = useFetch(handle ? `/api/user/info/${handle}` : null);
  const [isPending, startTransition] = useTransition();
  const years = getYearRange(user ? new Date(user.registeredAt) : new Date(), new Date()).map(year => ({
    label: year.toString(),
    value: year
  }));
  const [year, setYear] = useState(years[years.length - 1]);
  const {push} = useRouter();
  useEffect(() => {
    if (!user && error)
      push('/404');
  }, [!user && error]);
  return user ? (
    <Tabs colorScheme='arctic' variant='unstyled' size='sm' mt={16} align='center'>
      <TabList>
        <TabItem icon={IconInfoCircle}>
          About
        </TabItem>
        <TabItem icon={IconAbacus}>
          Problems
        </TabItem>
        <TabItem icon={IconUsersGroup}>
          Teams
        </TabItem>
      </TabList>
      <Center>
        <HStack align='stretch' justify='center'>
          <VStack mt={8} spacing={4}>
            <Gravatar email={user.email} hash={user.avatar} size={160} borderWidth={2}
              borderColor='arctic.400' />
            <VStack spacing={0}>
              <Heading size='md' whiteSpace='nowrap'>
                {user.displayName || user.handle}
              </Heading>
              <Text color='gray.500' fontSize='sm'>
                {user.displayName ? user.handle : ''}
              </Text>
            </VStack>
            {user.id === currentUser?.id && (
              <Button mt={4} w='100%' leftIcon={<IconUserEdit size={16} />} as={NextLink} href='/profile/edit'>
                Edit profile
              </Button>
            )}
            <Box />
            <Block>
              2670 <Icon as={IconBadgesFilled} mb={-0.5} size={16} display='inline' color='arctic.300' /> - <Text
                color={resolveRatingColor(2670)}
                as='span'>Grandmaster</Text>
              <br />
              2670 / 3000 - {(2670 / 3000 * 100).toFixed(0)}% to <Text color={resolveRatingColor(3000)}
                as='span'>Champion</Text>
              <Progress size='xs' my={2} value={(2670 / 3000 * 100)} sx={{
                '&>div[role="progressbar"]': {
                  bg: resolveRatingColor(3000)
                }
              }} />
            </Block>
            <VStack alignSelf='start' align='start'>
              <TextItem label='Organization' icon={IconBuilding}>
                {user.organization}
              </TextItem>
              <TextItem label='Registration date' icon={IconCalendar}>
                {dayjs(user.registeredAt).format('HH:mm:ss MMM D, YYYY')}
              </TextItem>
              {(user.connections || []).map((conn, i) => (
                <ConnectionItem key={i} {...conn} />
              ))}
            </VStack>
            <Block as={Wrap} p={2}>
              {(user.roles || []).map((role, i) => (
                <Box css={role.style} borderRadius='lg' key={i}
                  px={2} py={1}>
                  {role.name}
                </Box>
              ))}
            </Block>
          </VStack>
          <TabPanels pt={4} textAlign='start' maxW={984}>
            <TabPanel display='flex' flexDir='column' gap={4}>
              <Section>
                <Suspense fallback={<SkeletonText noOfLines={3} m={4} spacing={4} skeletonHeight={4} />}>
                  <Markdown url='/static/profile.md' />
                </Suspense>
              </Section>
              <Section title='Prizes & awards' icon={IconAward} px={4} py={2}>
                This user has not obtained any prizes or awards.
              </Section>
              <Section title='Rating history' icon={IconChartHistogram} px={4} py={2}>
                <RatingChart />
              </Section>
              <Section title='Activity' icon={IconActivity} px={4} pb={4}>
                <Box mb={4} bg='gray.800' px={4} py={3} borderRadius='xl'>
                  <Flex mb={2} alignItems='center'>
                    <Heading size='xs' as='h6' ml={2}>0 submissions in {year.label}</Heading>
                    <Spacer />
                    <ChakraSelect icon={IconCalendar} isLoading={isPending}
                      onChange={val => startTransition(() => setYear(val as any))}
                      value={year}
                      options={years} />
                  </Flex>
                  <HeatMap
                    startDate={new Date(year.value, 0, 1)}
                    endDate={new Date(year.value, 11, 31)}
                    value={[
                      {date: new Date(year.value, 3, 2), count: 5},
                      {date: new Date(year.value, 4, 2), count: 5},
                      {date: new Date(year.value, 7, 2), count: 1},
                      {date: new Date(year.value, 2, 2), count: 11},
                      {date: new Date(year.value, 8, 2), count: 32}
                    ]} />
                </Box>
                <Flex gap={4}>
                  <VStack flex={1} align='stretch' bg='gray.800' borderRadius='xl' px={4} py={3} spacing={4}>
                    <Heading size='xs' as='h6'>Recently solved problems</Heading>
                    <Flex flexDir='column' gap={2} h='100%' sx={{
                      '&>div': {
                        flex: 1,
                        borderRadius: 'lg'
                      }
                    }}>
                      {Repeat(<Skeleton />, 3)}
                    </Flex>
                  </VStack>
                  <Grid gap={4} autoFlow='column'
                    templateRows='repeat(2, 1fr)'>
                    {[{
                      label: 'Total problems solved',
                      value: 0
                    },
                    {
                      label: 'Problems solved today',
                      value: 0
                    },
                    {
                      label: 'Current streak',
                      value: 0
                    }, {
                      label: 'Highest streak',
                      value: 0
                    }].map(({label, value}, i) => (
                      <Stat bg='gray.800' px={4} py={2} borderRadius='xl' minW={200} key={i}>
                        <StatLabel>{label}</StatLabel>
                        <StatNumber>{value}</StatNumber>
                      </Stat>
                    ))}
                  </Grid>
                </Flex>
              </Section>
            </TabPanel>
          </TabPanels>
        </HStack>
      </Center>
    </Tabs>
  ) : <LoadingOverlay />;
}

ProfilePage.displayName = 'profile';
