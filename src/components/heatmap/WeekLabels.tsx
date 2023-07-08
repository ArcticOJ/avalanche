import React, {useMemo} from 'react';
import {HeatMapProps} from './Container';

export interface WeekLabelsProps extends React.SVGProps<SVGTextElement> {
  weekLabels: HeatMapProps['weekLabels'];
  rectSize: HeatMapProps['rectSize'];
  space: HeatMapProps['space'];
  topPad: number;
}

export default function WeekLabels({weekLabels = [], rectSize = 0, topPad = 0, space = 0}: WeekLabelsProps) {
  return useMemo(
    () => (
      <>
        {[...Array(7)].map((_, idx) => {
          if (weekLabels && weekLabels[idx]) {
            return (
              <text key={idx} x={15} y={topPad} dy={(idx + 1) * (rectSize + space) - 5}>
                {weekLabels[idx]}
              </text>
            );
          }
          return null;
        })}
      </>
    ),
    [rectSize, space, topPad, weekLabels]
  );
}
