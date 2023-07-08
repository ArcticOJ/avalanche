import React, {useMemo} from 'react';
import {HeatMapProps} from './Container';
import {useConst} from '@chakra-ui/react';

export interface LegendProps extends React.SVGProps<SVGRectElement> {
  panelColors: HeatMapProps['panelColors'];
  leftPad: number;
  legendCellSize: number;
  legendRender?: (props: React.SVGProps<SVGRectElement>) => React.ReactElement;
  topPad: number;
  space: number;
}

export default function Legend({
  panelColors,
  leftPad = 0,
  topPad = 0,
  space,
  legendCellSize = 0,
  legendRender,
  ...props
}: LegendProps) {
  const pColors = useConst(() => Object.values(panelColors || {}));
  return useMemo(
    () => (
      <>
        <text x={legendCellSize + leftPad} y={topPad + legendCellSize * 8 + 16}>Less</text>
        {pColors.map((color, key) => {
          const rectProps = {
            ...props,
            key,
            x: (legendCellSize + 1) * key + leftPad + 28 + space,
            y: topPad + legendCellSize * 8 + 6,
            fill: color,
            width: legendCellSize,
            height: legendCellSize
          };
          if (legendRender) return legendRender(rectProps);
          return <rect key={key} {...rectProps} />;
        })}
        <text x={leftPad + pColors.length * (legendCellSize + space) + 40}
          y={topPad + legendCellSize * 8 + 16}>More
        </text>
      </>
    ),
    [panelColors, props, legendCellSize, leftPad, topPad, legendCellSize, legendRender]
  );
}
