import {Chart} from 'react-chartjs-2';
import {
  Chart as CJS,
  LinearScale,
  LineElement,
  PointElement,
  ScatterController,
  TimeScale,
  Tooltip,
  TooltipModel
} from 'chart.js';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import React, {useCallback, useRef, useState, useTransition} from 'react';
import {Box, Heading, Text, useToken} from '@chakra-ui/react';
import {binarySearch} from 'lib/utils/binary';
import useThrottle from 'lib/hooks/useThrottle';
import dayjs from 'dayjs';
import {transition} from 'lib/utils/common';
import {ratingDistribution} from 'lib/constants/rating';
import {resolveRatingColor} from 'lib/utils/rating';
import {montserrat} from 'lib/themes/fonts';

// credit to DMOJ
class RatingChartController extends ScatterController {
  draw() {
    const {ctx, scales} = this.chart;
    const xAxis = scales['x'];
    const yAxis = scales['y'];
    ctx.save();
    ratingDistribution.forEach(range => {
      let yRangeBeginPixel = yAxis.getPixelForValue(range.begin);
      let yRangeEndPixel = yAxis.getPixelForValue(range.end);
      if (range.begin >= yAxis.max || range.end <= yAxis.min)
        return;
      yRangeEndPixel = Math.max(yAxis.top + 1, yRangeEndPixel);
      yRangeBeginPixel = Math.min(yAxis.bottom - 1, yRangeBeginPixel);
      if (yRangeBeginPixel < yRangeEndPixel) {
        return;
      }
      ctx.fillStyle = range.color + '80';
      ctx.fillRect(
        xAxis.left + 1,
        yRangeEndPixel,
        xAxis.right - xAxis.left,
        yRangeBeginPixel - yRangeEndPixel
      );
    });
    ctx.restore();
    super.draw();
  }
}

RatingChartController.id = 'rating';
RatingChartController.defaults = ScatterController.defaults;

CJS.register(RatingChartController, Tooltip, LinearScale, TimeScale, LineElement, PointElement);
CJS.defaults.font.family = montserrat;

const mockData = [{
  time: new Date('1/1/2022'),
  rating: 40
}, {
  time: new Date('1/6/2022'),
  rating: 700
},
{
  time: new Date('1/8/2022'),
  rating: 240
},
{
  time: new Date('2/11/2022'),
  rating: 940
},
{
  time: new Date('3/3/2022'),
  rating: 1300
},
{
  time: new Date('3/4/2022'),
  rating: 1000
},
{
  time: new Date('3/10/2022'),
  rating: 1350
},
{
  time: new Date('4/3/2022'),
  rating: 1440
},
{
  time: new Date('4/8/2022'),
  rating: 1700
},
{
  time: new Date('4/16/2022'),
  rating: 1920
},
{
  time: new Date('4/21/2022'),
  rating: 2200
},
{
  time: new Date('4/27/2022'),
  rating: 2700
},
{
  time: new Date('6/27/2022'),
  rating: 3290
},
{
  time: new Date('7/21/2022'),
  rating: 2670
}
];

const ratingHistory = mockData.map(f => f.rating);

export default function RatingChart() {
  const [a400, g100, g300] = useToken('colors', ['arctic.400', 'gray.100', 'gray.300']);
  const ratingColors = ratingHistory.map(f => resolveRatingColor(f));
  const tooltipRef = useRef<HTMLDivElement>();
  const [isPending, startTransition] = useTransition();
  const [selectedPoint, setSelectedPoint] = useState(0);
  // setState is triggered frequently, leading to continuous re-renders, preventing canvas hover animation from being triggered properly, so throttling it may mitigate the behavior.
  const updateState = useThrottle((currIndex) => currIndex != selectedPoint && startTransition(() => setSelectedPoint(currIndex)), 1e2);
  const openTooltip = useCallback(function (this: TooltipModel<'scatter'>, args: { chart: CJS }) {
    if (!this?.dataPoints?.[0]) return;
    const currIndex = this.dataPoints[0].dataIndex;
    updateState(currIndex);
    const {offsetLeft, offsetTop} = args.chart.canvas;
    const {opacity, caretX, caretY} = this;
    const x = offsetLeft + caretX;
    const y = offsetTop + caretY;
    tooltipRef.current.style.left = x + 'px';
    tooltipRef.current.style.top = y + 'px';
    requestAnimationFrame(() => tooltipRef.current.style.opacity = opacity.toString());
  }, []);
  return (
    <Box pos='relative' h={80}>
      <Box ref={tooltipRef} sx={{
        width: 'max-content',
        pointerEvents: 'none',
        pos: 'absolute',
        opacity: 0,
        borderRadius: 'lg',
        transform: 'translate(-50%, calc(-100% - 12px))',
        py: 2,
        px: 4,
        fontWeight: 600,
        top: 0,
        left: 0,
        bg: 'gray.700',
        ...transition(.2, ['opacity'/*, 'top', 'left'*/]),
        boxShadow: 'lg',
        color: 'gray.50'
      }}>
        <Heading as='h6' size='xs' mb={1}>
          Educational Round #1
        </Heading>
        <Text fontSize='xs'>
          Rank: ???
          <br />
          Time: {dayjs(mockData[selectedPoint].time).format('hh:mm:ss dddd, Do MMM YYYY')}
          <br />
          Rating: <Text as='span'
            color={selectedPoint === 0 ? 'gray.50' : ratingColors[selectedPoint - 1]}>{selectedPoint === 0 ? 0 : ratingHistory[selectedPoint - 1]}</Text> › <Text
            as='span'
            color={ratingColors[selectedPoint]}>{ratingHistory[selectedPoint]}</Text>
        </Text>
      </Box>
      <Chart type='rating' data={{
        datasets: [{
          label: 'Rating',
          normalized: true,
          parsing: {
            xAxisKey: 'time',
            yAxisKey: 'rating'
          },
          pointBorderColor: g100,
          pointBorderWidth: 3,
          pointHoverBorderWidth: 2,
          borderColor: a400,
          pointBackgroundColor: a400,
          pointRadius: 6,
          pointHoverRadius: 7,
          showLine: true,
          data: mockData
        }]
      }} options={{
        elements: {
          line: {
            tension: 0
          }
        },
        maintainAspectRatio: false,
        onClick(event, element) {
          if (element[0])
            alert(JSON.stringify(mockData[element[0].index]));
        },
        onHover(event, element) {
          (event.native.target as HTMLElement).style.cursor = element[0] ? 'pointer' : 'default';
        },
        plugins: {
          tooltip: {
            enabled: false,
            position: 'nearest',
            external: openTooltip
          }
        },
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              minUnit: 'day'
            },
            ticks: {
              color: g300
            }
          },
          y: {
            suggestedMin: Math.max(0, Math.min.apply(null, ratingHistory) - 50),
            suggestedMax: Math.max.apply(null, ratingHistory) + 50,
            ticks: {
              stepSize: 100,
              autoSkip: false,
              color: g300,
              callback(val: number) {
                return binarySearch(ratingDistribution, val, (v, x) => v.end - x) ? this.getLabelForValue(val) : '';
              }
            }
          }
        },
        transitions: {
          'active': {
            animation: {
              easing: 'easeOutExpo',
              duration: 150
            }
          }
        }
      }} />
    </Box>
  );
}
