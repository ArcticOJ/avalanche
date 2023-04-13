import {
  Button,
  HStack,
  Image,
  Link,
  Skeleton,
  Spacer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBoolean,
  VStack
} from '@chakra-ui/react';
import {AtSign, Briefcase, Edit, Lock, LogIn, Mail, User} from 'react-feather';
import Separator from 'components/Separator';
import {FastField, Formik} from 'formik';
import TextField from 'components/TextField';
import {notify} from 'lib/notifications';
import CheckBox from 'components/CheckBox';
import {createOAuthRequest, request} from 'lib/utils/common';
import {bool as yupBool, object as yupObject, ref as yupRef, string as yupString} from 'yup';
import PasswordBox from 'components/PasswordBox';
import {useAuth} from 'lib/hooks/useAuth';
import {usei18n} from 'lib/hooks/usei18n';
import BaseModal from 'components/modals/BaseModal';
import TabIcon from 'components/TabIcon';
import useFetch from 'lib/hooks/useFetch';
import {resolveProps} from 'lib/oauth/resolver';

function OAuthLoginButton({provider}) {
  const {imageProps, buttonProps} = resolveProps(provider);
  return (
    <Button flex={1} key={provider} onClick={() => createOAuthRequest(provider, 'login')}
      leftIcon={<Image alt='OAuth' {...imageProps} />} {...buttonProps} />
  );
}

function LoginForm() {
  const {revalidate} = useAuth();
  const {data, isLoading} = useFetch('/api/oauth', {
    revalidateOnFocus: false,
    fallbackData: {
      providers: []
    }
  });
  const {t} = usei18n();
  return (
    <Formik initialValues={{
      handle: '',
      password: '',
      rememberMe: true
    }}
    validationSchema={yupObject({
      handle: yupString().required('Handle is required.').min(3, 'Handle should be longer than 3 characters.'),
      password: yupString().required('Password is required.').min(6, 'Password must be at least 6 characters.'),
      rememberMe: yupBool()
    })}
    onSubmit={async (values, {setSubmitting}) => {
      try {
        const r = await request({
          endpoint: '/api/auth/login',
          method: 'POST',
          body: values
        });
        await revalidate();
        notify('Response', JSON.stringify(r));
      } finally {
        setSubmitting(false);
      }
    }}>
      {({handleSubmit, isSubmitting}) => (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align='stretch'>
            <TextField placeholder='Handle or email' icon={User} name='handle' autoComplete='username' />
            <TextField placeholder='Password' icon={Lock} type='password' name='password'
              autoComplete='current-password' />
            <HStack>
              <FastField as={CheckBox} name='rememberMe'>
                {t('auth.rememberMe')}
              </FastField>
              <Spacer />
              <Link color='arctic.400' fontSize={13} fontWeight={600}>
                {t('auth.forgotPwd')}
              </Link>
            </HStack>
            <Button type='submit'
              loadingText='Logging in'
              isLoading={isSubmitting}
              leftIcon={<LogIn size={16} />}>
              {t('auth.login')}
            </Button>
            {data.providers.length > 0 ? (
              <>
                <Separator>
                  {t('auth.orLoginWith')}
                </Separator>
                <HStack sx={{
                  'img': {
                    marginTop: -0.5
                  }
                }}>
                  {/* TODO: customize oauth providers */}
                  {data.providers.map(provider => (
                    <OAuthLoginButton provider={provider} key={provider} />
                  ))}
                </HStack>
              </>
            ) : isLoading ? (
              <Skeleton w='100%' h={8} borderRadius='xl' />
            ) : <></>}
          </VStack>
        </form>
      )}
    </Formik>
  );
}

function RegisterForm() {
  const {t} = usei18n();
  return (
    <Formik
      validationSchema={yupObject({
        displayName: yupString().notRequired(),
        handle: yupString().required('Handle is required.').matches(/^(\S+)([A-Za-z_]\w*)$/ug, 'Handle must be alphanumeric.').min(3, 'Handle should be longer than 3 characters.'),
        email: yupString().required('Email is required.').email('Email must match the form user@example.tld.'),
        password: yupString().required('Password is required.').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{6,}$/g, 'Password must match shown criteria.'),
        confirmPassword: yupString().required('Confirm password is required.').oneOf([yupRef('password')], 'Confirm password does not match.'),
        organization: yupString().notRequired()
      })}
      initialValues={{
        displayName: '',
        handle: '',
        email: '',
        password: '',
        confirmPassword: '',
        organization: ''
      }} onSubmit={async (values, {setSubmitting}) => {
        try {
          const r = await request({
            endpoint: '/api/auth/register',
            method: 'POST',
            body: values
          });
          notify('Response', JSON.stringify(r));
        } finally {
          setSubmitting(false);
        }
      }}>
      {({handleSubmit, isSubmitting}) => (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align='stretch'>
            <TextField placeholder='Display name' icon={User} autoComplete='name' name='displayName' />
            <TextField placeholder='Handle' icon={AtSign} autoComplete='username' name='handle' />
            <TextField placeholder='Email' icon={Mail} type='email' name='email'
              description='This email might be used to retrieve your avatar via Gravatar.' />
            <PasswordBox name='password' placeholder='Password' icon={Lock} />
            <TextField placeholder='Confirm password' icon={Lock} type='password' autoComplete='off'
              name='confirmPassword' />
            <TextField placeholder='Organization' icon={Briefcase} autoComplete='organization'
              name='organization' />
            <Text fontSize={13} fontWeight={600}>{t('acceptToc')}<Link color='arctic.200'
              fontSize={13}>{t('toc')}</Link></Text>
            <Button
              type='submit'
              loadingText='Registering'
              isLoading={isSubmitting}
              leftIcon={<Edit size={16} />}>
              {t('auth.register')}
            </Button>
          </VStack>
        </form>
      )}
    </Formik>
  );
}

export default function AuthModal({isOpen, onClose}) {
  const [isLogin, {on, off}] = useBoolean(true);
  const {t} = usei18n();
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={isLogin ? t('auth.log2arctic') : t('auth.reg4account')}>
      <Tabs variant='filled' index={isLogin ? 0 : 1} onChange={c => c === 1 ? off() : on()} isFitted>
        <TabList gap={2} mx={4}>
          <TabIcon icon={LogIn}>
            {t('auth.login')}
          </TabIcon>
          <TabIcon icon={Edit}>
            {t('auth.register')}
          </TabIcon>
        </TabList>
        <TabPanels>
          <TabPanel>
            <LoginForm />
          </TabPanel>
          <TabPanel>
            <RegisterForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </BaseModal>
  );
}
