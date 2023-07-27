import React, {useMemo} from 'react';
import WeekLabels from './WeekLabels';
import MonthLabels from './MonthLabels';
import Legend, {LegendProps} from './Legend';
import dayjs from 'dayjs';

export const oneDay = 24 * 60 * 60 * 1000;

export interface HeatMapValue {
  date: Date;
  count: number;
}

export interface HeatMapItem {
  date: string;
  count: number;
  column: number;
  row: number;
  index: number;
}

export type RectProps<T = SVGRectElement> = React.SVGProps<T>;

export interface HeatMapProps extends React.SVGProps<SVGSVGElement> {
  startDate?: Date;
  endDate?: Date;
  rectSize?: number;
  legendCellSize?: number;
  space?: number;
  rectProps?: RectProps;
  legendRender?: LegendProps['legendRender'];
  rectRender?: <E = SVGRectElement>(
    data: E & { key: number },
    valueItem: HeatMapItem
  ) => React.ReactElement | void;
  value?: Array<HeatMapValue>;
  weekLabels?: string[] | false;
  monthLabels?: string[] | false;
  panelColors?: Record<number, string>;
  paddingLeft?: number;

  formatDate(date: Date): string;
}

function existColor(num = 0, nums: number[], panelColors: Record<number, string> = {}) {
  let color = '';
  for (let a = 0; a < nums.length; a += 1) {
    if (nums[a] > num) {
      color = panelColors[nums[a]];
      break;
    }
    color = panelColors[nums[a]];
  }
  return color;
}

export default function Container(props: HeatMapProps) {
  const {
    rectSize = 11,
    space = 2,
    startDate = new Date(),
    endDate,
    rectProps,
    rectRender,
    legendRender,
    value = [],
    paddingLeft,
    weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    panelColors = {0: '#EBEDF0', 8: '#7BC96F', 4: '#C6E48B', 12: '#239A3B', 32: '#196127'},
    formatDate,
    ...other
  } = props || {};
  const svgRef = React.createRef<SVGSVGElement>();
  const nums = Object.keys(panelColors).map((item) => parseInt(item, 10)).sort((a, b) => a - b);
  const data = useMemo<Record<string, HeatMapValue>>(() => Object.fromEntries(value.map(f => [formatDate(f.date), f])), [value]);

  const gridNum = Math.ceil((dayjs(endDate).diff(startDate, 'day') + 1) / 7);

  const topPad = monthLabels ? 20 : 5;
  const leftPad = weekLabels ? 28 : 5 + (paddingLeft || 0);

  const height = topPad + (rectSize + space + 1) * 8;
  const width = gridNum * (space + rectSize) + paddingLeft + leftPad;

  const initStartDate = !startDate.getDay() ? startDate : new Date(startDate.getTime() - startDate.getDay() * oneDay);

  return (
    <svg ref={svgRef} width={`${width}px`} height={`${height}px`} {...other}>
      <Legend
        legendRender={legendRender}
        panelColors={panelColors}
        legendCellSize={rectSize}
        leftPad={leftPad}
        topPad={topPad}
        space={space}
      />
      <WeekLabels weekLabels={weekLabels} rectSize={rectSize} space={space} topPad={topPad} />
      <MonthLabels
        monthLabels={monthLabels}
        rectSize={rectSize}
        space={space}
        leftPad={leftPad}
        colNum={gridNum}
        endDate={endDate}
        startDate={initStartDate}
      />
      <g transform={`translate(${leftPad}, ${topPad})`} width='100%'>
        {gridNum > 0 &&
          [...Array(gridNum)].map((_, idx) => (
            <g key={idx} data-column={idx}>
              {[...Array(7)].map((_, cidx) => {
                const dayProps: RectProps = {
                  ...rectProps,
                  key: cidx,
                  fill: '#EBEDF0',
                  width: rectSize,
                  height: rectSize,
                  x: idx * (rectSize + space),
                  y: (rectSize + space) * cidx
                };
                const currentDate = new Date(initStartDate.getTime() + oneDay * (idx * 7 + cidx));
                const date = formatDate(currentDate);
                const count = data[date]?.count || 0;
                const dataProps = {
                  count,
                  date,
                  row: cidx,
                  column: idx,
                  index: idx * 7 + cidx
                };
                if (currentDate > endDate || currentDate < startDate)
                  return null;
                if (data[date])
                  dayProps.fill = existColor(data[date].count || 0, nums, panelColors);
                else if (panelColors && panelColors[0])
                  dayProps.fill = panelColors[0];
                if (rectRender && typeof rectRender === 'function') {
                  const elm = rectRender({...dayProps, key: cidx}, dataProps);
                  if (elm && React.isValidElement(elm))
                    return elm;
                }
                return (
                  <rect
                    key={idx}
                    {...dayProps}
                    data-date={date}
                    data-count={count}
                    data-index={dataProps.index}
                    data-row={dataProps.row}
                    data-column={dataProps.column}
                  />
                );
              })}
            </g>
          ))}
      </g>
    </svg>
  );
}
