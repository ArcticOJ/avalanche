import {Chart} from 'react-chartjs-2';
import {
  Chart as CJS,
  ChartTypeRegistry,
  LinearScale,
  LineElement,
  PointElement,
  ScatterController,
  TimeScale,
  Tooltip,
  TooltipModel
} from 'chart.js';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
import React, {useCallback, useMemo, useRef, useState, useTransition} from 'react';
import {Box, Heading, Text, useToken} from '@chakra-ui/react';
import {binarySearch, lowerBound} from 'lib/utils/binary';
import useThrottle from 'lib/hooks/useThrottle';

const ratingDistribution = [
  {
    begin: 0,
    end: 1200,
    color: '#737373'
  },
  {
    begin: 1200,
    end: 1400,
    color: '#2F855A'
  },
  {
    begin: 1400,
    end: 1600,
    color: '#0BC5EA'
  },
  {
    begin: 1600,
    end: 1900,
    color: '#2b6cb0'
  },
  {
    begin: 1900,
    end: 2100,
    color: '#6B46C1'
  },
  {
    begin: 2100,
    end: 2400,
    color: '#B7791F'
  },
  {
    begin: 2400,
    end: 3000,
    color: '#C53030'
  },
  {
    begin: 3000,
    end: 4000,
    color: '#822727'
  }
];

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
      if (range.begin >= yAxis.max || range.end <= yAxis.min) {
        return;
      }
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

function resolveRatingColor(rating: number): string {
  console.log(rating);
  const rank = lowerBound(ratingDistribution, rating, (x, y) => {
    console.log(x, y);
    return x.begin - y;
  });
  if (rank == null) return ratingDistribution[0].color;
  return rank.color;
}

RatingChartController.id = 'rating';
RatingChartController.defaults = ScatterController.defaults;

CJS.register(RatingChartController, Tooltip, LinearScale, TimeScale, LineElement, PointElement);
CJS.defaults.font.family = 'Montserrat, sans-serif';

const mockData = [{
  x: new Date('1/1/2022'),
  y: 40
}, {
  x: new Date('1/2/2022'),
  y: 700
},
{
  x: new Date('1/3/2022'),
  y: 240
},
{
  x: new Date('2/3/2022'),
  y: 940
},
{
  x: new Date('3/3/2022'),
  y: 1300
},
{
  x: new Date('3/4/2022'),
  y: 1000
},
{
  x: new Date('3/10/2022'),
  y: 1350
},
{
  x: new Date('4/3/2022'),
  y: 1440
},
{
  x: new Date('4/8/2022'),
  y: 1700
},
{
  x: new Date('4/16/2022'),
  y: 1920
},
{
  x: new Date('4/21/2022'),
  y: 2200
},
{
  x: new Date('4/27/2022'),
  y: 2700
}
];

const ratingCutoff = ratingDistribution.map(f => f.end);

export default function RatingChart() {
  const [a400, g100, g300] = useToken('colors', ['arctic.400', 'gray.100', 'gray.300']);
  const ratingHistory = useMemo(() => mockData.map(f => f.y), []);
  const ratingColors = useMemo(() => ratingHistory.map(f => resolveRatingColor(f)), []);
  const tooltipRef = useRef<HTMLDivElement>();
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState({
    from: 0,
    to: 0
  });
  // TODO: openTooltip is triggered frequently so setState may not work correctly when called multiple times in a row within a short time, so throttling it will mitigate the behavior.
  const updateState = useThrottle((currIndex: number) => startTransition(() => setState({
    from: currIndex - 1,
    to: currIndex
  })), 1e2);
  const openTooltip = useCallback(function (this: TooltipModel<'scatter'>, args: { chart: CJS }) {
    if (this.dataPoints.length === 0) return;
    const currIndex = this.dataPoints[0].dataIndex;
    updateState(currIndex);
    const {offsetLeft, offsetTop} = args.chart.canvas;
    const {opacity, caretX, caretY} = this;
    const x = offsetLeft + caretX;
    const y = offsetTop + caretY;
    tooltipRef.current.style.left = x + 'px';
    tooltipRef.current.style.top = y + 'px';
    tooltipRef.current.style.opacity = opacity.toString();
  }, []);
  return (
    <div style={{position: 'relative', height: '100%'}}>
      <Box ref={tooltipRef} sx={{
        width: 'max-content',
        pointerEvents: 'none',
        pos: 'absolute',
        opacity: 0,
        borderRadius: 'lg',
        transform: 'translate(-50%, calc(-100% - 8px))',
        py: 2,
        px: 4,
        fontWeight: 600,
        bg: 'gray.700',
        transitionDuration: '.35s',
        transitionTimingFunction: 'ease-in-out',
        transitionProperty: 'z-index, opacity',
        boxShadow: 'lg',
        color: 'gray.50'
      }}>
        <Heading as='h6' size='xs' mb={1}>
          Educational Round #1
        </Heading>
        <Text fontSize='xs'>
          Rank: ???
          <br />
          Rating: <Text as='span'
            color={state.from < 0 ? 'gray.50' : ratingColors[state.from]}>{state.from < 0 ? 0 : ratingHistory[state.from]}</Text> › <Text
            as='span'
            color={ratingColors[state.to]}>{ratingHistory[state.to]}</Text>
        </Text>
      </Box>
      <Chart type={'rating' as keyof ChartTypeRegistry} data={{
        datasets: [{
          label: 'Rating',
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
        responsive: true,
        maintainAspectRatio: false,
        transitions: {
          'active': {
            animation: {
              easing: 'easeOutExpo',
              duration: 150
            }
          }
        },
        onClick(event, element, chart) {
          if (element[0])
            alert(JSON.stringify(mockData[element[0].index]));
          console.log(event, element, chart);
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
        elements: {
          line: {
            tension: 0
          }
        },
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
                return binarySearch(ratingCutoff, val) !== -1 ? this.getLabelForValue(val) : '';
              }
            }
          }
        }
      }} />
    </div>
  );
}
