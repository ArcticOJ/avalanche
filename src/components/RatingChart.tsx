import React, {SVGProps, useMemo} from 'react';
import {Box, Heading, Text, useToken} from '@chakra-ui/react';
import dayjs from 'dayjs';
import {resolveRating} from 'lib/utils/rating';
import {
  Brush,
  CartesianGrid, Dot, DotProps,
  Legend, ReferenceArea,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip, TooltipProps,
  XAxis,
  YAxis,
  ZAxis
} from 'recharts';
import {ratingDistribution} from 'lib/constants/rating';
import {montserrat} from 'lib/themes/fonts';
import styles from 'styles/RatingChart.module.scss';

function TooltipContent({active, payload, label}: TooltipProps<any, any>) {
  const pl = payload?.[0]?.payload;
  return active && payload && payload.length === 2 && (
    <Box pointerEvents='none' borderRadius='xl' py={2} px={4} fontWeight={600} boxShadow='lg' bg='gray.800'>
      <Heading as='h6' size='xs' mb={1}>
        {pl.contest}
      </Heading>
      <Text fontSize='xs'>
        Rank: #2
        <br />
        Time: {dayjs(payload[0].value).format('LLLL')}
        <br />
        Rating: <Text as='span'
          color={pl._from.color}>{pl.from}</Text> › <Text
          as='span'
          color={pl._to.color}>{pl.to}</Text>
        {pl._from.title !== pl._to.title && (
          <>
            <br />
            <Text as='span'
              color={pl._from.color}>{pl._from.title}</Text> › <Text
              as='span'
              color={pl._to.color}>{pl._to.title}</Text>
          </>
        )}
        <br />
      </Text>
    </Box>
  );
}

const mockData = [{
  contest: 'Educational Round #1',
  time: new Date('1/1/2022'),
  rating: 40
}, {
  contest: 'Educational Round #2',
  time: new Date('1/27/2022'),
  rating: 700
},
{
  contest: 'Arctic Round #1',
  time: new Date('2/15/2022'),
  rating: 240
},
{
  contest: 'VOI Practice 2023',
  time: new Date('3/3/2022'),
  rating: 1300
},
{
  contest: 'VNOI Cup 2023',
  time: new Date('3/16/2022'),
  rating: 1000
},
{
  contest: 'Goodbye 2023',
  time: new Date('9/22/2022'),
  rating: 3209
}
].map((d, i, arr) => ({
  time: +d.time,
  from: i === 0 ? 0 : arr[i - 1].rating,
  contest: d.contest,
  to: d.rating,
  _from: resolveRating(i === 0 ? 0 : arr[i - 1].rating),
  _to: resolveRating(d.rating)
}));

function getTicks() {
  const arr = Array.from(new Set(ratingDistribution.map(r => [r.begin, r.end]).flat()));
  arr.pop();
  return arr.sort((a, b) => a - b);
}

function Point({cx, cy, fill, stroke}: SVGProps<any>) {
  return (
    <circle cx={cx} cy={cy} r={6} className={styles.dot} fill={fill} stroke={stroke} strokeWidth={2} />
  );
}

const ticks = getTicks();

export default function RatingChart() {
  const [a400, g100, g300] = useToken('colors', ['arctic.400', 'gray.100', 'gray.300']);
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <ScatterChart style={{
        fontWeight: 600,
        fontFamily: montserrat,
        fontSize: 13
      }}
      margin={{
        top: 8,
        right: 8,
        left: 8,
        bottom: 8
      }}
      >
        {ratingDistribution.map((r, i) => (
          <ReferenceArea key={i} y1={r.begin} ifOverflow='hidden' y2={r.end} fill={r.color} />
        ))}
        <XAxis scale='time' domain={['auto', 'auto']} type='number' dataKey='time'
          tickFormatter={time => dayjs(time).format('ll')}
          name='Time' />
        <YAxis width={36} ticks={ticks} type='number'
          domain={[0, 'dataMax']} dataKey='to' name='Rating' />
        <Tooltip content={TooltipContent} />
        <Scatter data={mockData} line strokeWidth={2} shape={<Point fill={a400} stroke={g100} />} fill={a400} />
        <CartesianGrid vertical={false} strokeOpacity={0.2} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
