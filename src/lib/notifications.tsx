import {createStandaloneToast} from '@chakra-ui/react';
import Notification from 'components/notifications/Notification';
import {AlertTriangle, CheckCircle, Icon, Info, XOctagon} from 'react-feather';
import {createElement, ReactNode} from 'react';
import {ToastStatus} from '@chakra-ui/toast/dist/toast.types';

const {
  toast
} = createStandaloneToast();

function getDefaultIcon(status: ToastStatus): Icon {
  return status === 'success' ? CheckCircle : status === 'error' ? XOctagon : status === 'warning' ? AlertTriangle : status === 'info' ? Info : null;
}

export function notify(title: string, message: ReactNode | string, status: ToastStatus = 'info', icon: Icon = getDefaultIcon(status)) {
  toast({
    title,
    description: message,
    duration: 1e4,
    position: 'bottom-right',
    icon: icon ? createElement(icon, {
      size: 16
    }) : <></>,
    render(props) {
      return (
        <Notification title={props.title} message={props.description} icon={props.icon} status={status}
          onClose={props.onClose} />
      );
    }
  });
}
