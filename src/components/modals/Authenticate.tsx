import {
  Button,
  HStack,
  Image,
  Link,
  Spacer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBoolean,
  VStack
} from '@chakra-ui/react';
import {AtSign, Briefcase, Edit, GitHub, Lock, LogIn, Mail, User} from 'react-feather';
import Separator from 'components/Separator';
import {FastField, Formik} from 'formik';
import TextField from 'components/TextField';
import {notify} from 'lib/notifications';
import CheckBox from 'components/CheckBox';
import {request} from 'lib/utils';
import {bool as yupBool, object as yupObject, ref as yupRef, string as yupString} from 'yup';
import PasswordBox from 'components/PasswordBox';
import {useAuth} from 'lib/hooks/useAuth';
import {usei18n} from 'lib/hooks/usei18n';
import BaseModal from 'components/modals/BaseModal';
import TabIcon from 'components/TabIcon';

function LoginForm() {
  const {revalidate} = useAuth();
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
      rememberMe: yupBool().default(true)
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
            <TextField placeholder='Handle or email' icon={User} name='handle' />
            <TextField placeholder='Password' icon={Lock} type='password' name='password' />
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
            <Separator>
              {t('auth.orLoginWith')}
            </Separator>
            <HStack>
              <Button flex={1} colorScheme='gray' leftIcon={<GitHub size={16} />}>
                GitHub
              </Button>
              <Button bg='#9cace5' _hover={{
                bg: '#8095de'
              }} _active={{
                bg: '#7289da'
              }} flex={1}
              leftIcon={<Image boxSize={4}
                src={'data:image/svg+xml,%3C%3Fxml version=\'1.0\' encoding=\'UTF-8\'%3F%3E%3Csvg width=\'800px\' height=\'800px\' viewBox=\'0 -28.5 256 256\' version=\'1.1\' xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' preserveAspectRatio=\'xMidYMid\'%3E%3Cg%3E%3Cpath d=\'M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z\' fill=\'currentColor\' fill-rule=\'nonzero\'%3E%3C/path%3E%3C/g%3E%3C/svg%3E'}
                alt='Discord' />}>
                Discord
              </Button>
            </HStack>
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
