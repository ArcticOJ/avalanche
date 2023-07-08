import {Tooltip, useToken} from '@chakra-ui/react';
import Container, {HeatMapProps} from './Container';
import dayjs from 'dayjs';
import styles from 'styles/HeatMap.module.scss';

export default function HeatMap({startDate, endDate, ...props}: Omit<HeatMapProps, 'formatDate'>) {
  const [a0, a2, a4, a10, a20, a30] = useToken('colors', ['gray.700', 'arctic.600', 'arctic.500', 'arctic.400', 'arctic.300', 'arctic.200']);
  return (
    <Container
      startDate={startDate}
      endDate={endDate}
      paddingLeft={4}
      className={styles.heatmap}
      formatDate={date => dayjs(date).format('ddd, Do MMM YYYY')}
      panelColors={{
        0: a0,
        2: a2,
        4: a4,
        10: a10,
        20: a20,
        30: a30
      }}
      rectSize={14} rectRender={(props, data) => (
        <Tooltip key={props.key} hasArrow
          label={`${data.count} problems on ${data.date}`}
          placement='top'>
          <rect rx={5} />
        </Tooltip>
      )} legendRender={props => (
        <rect {...props} rx={5} />
      )} {...props} />
  );
}
