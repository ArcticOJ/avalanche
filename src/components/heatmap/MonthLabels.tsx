import React, {useMemo} from 'react';
import {HeatMapProps, oneDay} from './Container';

export interface MonthLabelsProps extends React.SVGProps<SVGTextElement> {
  monthLabels: HeatMapProps['monthLabels'];
  rectSize: HeatMapProps['rectSize'];
  space: HeatMapProps['space'];
  leftPad: number;
  colNum: number;
  startDate: HeatMapProps['startDate'];
  endDate: HeatMapProps['endDate'];
}

export default function MonthLabels({
  monthLabels = [],
  rectSize = 0,
  space = 0,
  leftPad = 0,
  colNum = 0,
  endDate,
  startDate
}: MonthLabelsProps) {
  const data = useMemo(() => {
    if (monthLabels === false || colNum < 1) return [];

    return [...Array(colNum * 7)]
      .map((_, idx) => {
        if ((idx / 7) % 1 === 0) {
          const date = new Date(startDate?.getTime() + idx * oneDay);
          const month = date.getMonth();
          if (endDate < date) return null;
          return {col: idx / 7, index: idx, month, day: date.getDate(), monthStr: monthLabels[month], date};
        }
        return null;
      })
      .filter(Boolean)
      .filter((item, idx, list) => idx === 0 || list[idx - 1]?.month !== item?.month)
      .filter((item, idx, list) => idx < list.length - 1 && list[idx + 1].month > item.month || idx == list.length - 1);
  }, [colNum, monthLabels, startDate]);
  return useMemo(
    () => (
      <>
        {[...data].map((item, idx) => {
          return (
            <text
              key={idx}
              data-size={rectSize}
              x={leftPad + space + space}
              y={15}
              dx={leftPad + item?.col * (rectSize + space)}
              textAnchor='start'
            >
              {item?.monthStr}
            </text>
          );
        })}
      </>
    ),
    [data, leftPad, rectSize, space]
  );
}
