import {
  Button,
  Center,
  Heading,
  HStack,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  VStack
} from '@chakra-ui/react';
import {Activity, Award, BookOpen, Briefcase, Clock, DivideSquare, Edit, Info, Users, Watch} from 'react-feather';
import NextLink from 'next/link';
import Gravatar from 'components/Gravatar';
import Markdown from 'components/Markdown';
import Section from 'components/Section';
import React, {createElement} from 'react';
import {format} from 'fecha';
import useRequiredAuth from 'lib/hooks/useRequiredAuth';
import {TabItem} from 'components/TabItem';
import HeatMap from 'components/HeatMap';

function TextItem({label, icon, children}) {
  return (
    <HStack color='arctic.200'>
      <Tooltip label={label}>
        {createElement(icon, {
          size: 16
        })}
      </Tooltip>
      <Text fontWeight={600} fontSize='sm' color='initial'>
        {children}
      </Text>
    </HStack>
  );
}

export default function ProfilePage() {
  const {user, isLoggedIn} = useRequiredAuth();
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
        <HStack align='stretch' justify='center' maxW='80%' minW='60%'>
          <VStack mt={8} spacing={4}>
            <Gravatar email='admin@xwork.space' size={160} borderWidth={2}
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
              <TextItem label='Registration date' icon={Clock}>
                {format(new Date(user.registeredAt), 'HH:mm:ss MMM D, YYYY')}
              </TextItem>
              <TextItem label='Current time' icon={Watch}>
                {new Date().toLocaleTimeString('en-US', {
                  timeZone: 'Europe/Berlin'
                })}
                <Text color='gray' as='span' ml={1}>
                  (UTC +01:00)
                </Text>
              </TextItem>
            </VStack>
          </VStack>
          <TabPanels pt={4} textAlign='start'>
            <TabPanel display='flex' flexDir='column' gap={4}>
              <Section title='Readme' icon={BookOpen}>
                <Markdown url='/static/profile.md' />
              </Section>
              <Section title='Prizes & awards' icon={Award} px={4} py={2}>
                This user has not obtained any prizes or awards.
              </Section>
              <Section title='Activity' icon={Activity} px={4} pb={4}>
                <HeatMap startDate={new Date()} value={[
                  {date: '2023/03/01', count: 5, content: 'test'},
                  {date: '2023/03/02', count: 5, content: 'test'},
                  {date: '2023/03/03', count: 1, content: 'test'},
                  {date: '2023/03/04', count: 11, content: 'test'},
                  {date: '2023/02/08', count: 32, content: 'test'}
                ]} />
              </Section>
            </TabPanel>
          </TabPanels>
        </HStack>
      </Center>
    </Tabs>
  );
}

ProfilePage.displayName = 'profile';
