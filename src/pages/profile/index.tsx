import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  HStack,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  VStack
} from '@chakra-ui/react';
import {
  Activity,
  Award,
  BarChart2,
  BookOpen,
  Briefcase,
  Calendar,
  Clock,
  DivideSquare,
  Edit,
  Info,
  Users
} from 'react-feather';
import NextLink from 'next/link';
import Gravatar from 'components/Gravatar';
import Section from 'components/Section';
import React, {createElement} from 'react';
import {TabItem} from 'components/TabItem';
import HeatMap from 'components/HeatMap';
import dynamic from 'next/dynamic';
import Discord from 'components/icons/Discord';
import {Repeat} from 'immutable';
import dayjs from 'dayjs';

const Markdown = dynamic(() => import('components/Markdown'), {
  suspense: true,
  ssr: false
});

const RatingChart = dynamic(() => import('components/RatingChart'), {
  ssr: false
});

function TextItem({label, icon, children}) {
  return (
    <HStack color='arctic.200'>
      <Tooltip label={label} placement='left'>
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

export default function ProfilePage() {
  const isLoggedIn = true;
  const user = {
    avatar: '4e10bfe7bba9f3a425e1f4cab1d3dc83',
    displayName: 'Nguyen Thanh Quang',
    handle: 'AlphaNecron',
    organization: 'Arctic LLC',
    registeredAt: new Date('12/12/2006').toISOString()
  };
  //const {user, isLoggedIn} = useRequiredAuth();
  return isLoggedIn && (
    <Tabs colorScheme='arctic' variant='unstyled' size='sm' mt={16} align='center'>
      <TabList>
        <TabItem icon={Info}>
          About
        </TabItem>
        <TabItem icon={DivideSquare}>
          Problems
        </TabItem>
        <TabItem icon={Users}>
          Teams
        </TabItem>
      </TabList>
      <Center>
        <HStack align='stretch' justify='center'>
          <VStack mt={8} spacing={4}>
            <Gravatar hash={user.avatar} size={160} borderWidth={2}
              borderColor='arctic.400' />
            <VStack spacing={0}>
              <Heading size='md' whiteSpace='nowrap'>
                {user.displayName || user.handle}
              </Heading>
              <Text color='gray.500' fontSize='sm'>
                {user.displayName ? user.handle : ''}
              </Text>
            </VStack>
            <Button mt={4} w='100%' leftIcon={<Edit size={16} />} as={NextLink} href='/profile/edit'>
              Edit profile
            </Button>
            <VStack alignSelf='start' align='start'>
              <TextItem label='Organization' icon={Briefcase}>
                {user.organization}
              </TextItem>
              <TextItem label='Registration date' icon={Calendar}>
                {dayjs(user.registeredAt).format('HH:mm:ss MMM D, YYYY')}
              </TextItem>
              <TextItem label='Current time' icon={Clock}>
                {new Date().toLocaleTimeString('en-US', {
                  timeZone: 'Europe/Berlin'
                })}
                <Text color='gray' as='span' ml={1}>
                  (UTC +01:00)
                </Text>
              </TextItem>
              <TextItem label='GitHub' icon={Discord}>
              </TextItem>
            </VStack>
          </VStack>
          <TabPanels pt={4} textAlign='start' minW={1024} maxW={1024}>
            <TabPanel display='flex' flexDir='column' gap={4}>
              <Section title='Readme' icon={BookOpen}>
                <Markdown url='/static/profile.md' />
              </Section>
              <Section title='Prizes & awards' icon={Award} px={4} py={2}>
                This user has not obtained any prizes or awards.
              </Section>
              <Section title='Rating history' icon={BarChart2} h={80} px={4} py={2}>
                <RatingChart />
              </Section>
              <Section title='Activity' icon={Activity} px={4} pb={4}>
                <Box mb={4} bg='gray.800' px={4} py={3} borderRadius='xl'
                  overflow='auto'>
                  <Heading size='xs' as='h6' mb={2}>0 submissions in the last year</Heading>
                  <HeatMap
                    startDate={new Date('01/01/2022')}
                    endDate={new Date('30/12/2024')}
                    value={[
                      {date: '2022/12/01', count: 5, content: 'test'},
                      {date: '2022/06/02', count: 5, content: 'test'},
                      {date: '2022/05/03', count: 1, content: 'test'},
                      {date: '2022/04/04', count: 11, content: 'test'},
                      {date: '2022/02/08', count: 32, content: 'test'}
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
                    }].map(({label, value}) => (
                      <Stat bg='gray.800' px={4} py={2} borderRadius='xl' minW={200} key={label}>
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
  );
}

ProfilePage.displayName = 'profile';
