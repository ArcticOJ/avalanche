import {Tooltip, useToken} from '@chakra-ui/react';
import {classes} from 'lib/utils/common';
import type {HeatMapProps} from '@uiw/react-heat-map';
import SVG from '@uiw/react-heat-map/lib/SVG';

export default function HeatMap({className, ...props}: HeatMapProps) {
  const [a0, a2, a4, a10, a20, a30] = useToken('colors', ['gray.700', 'arctic.600', 'arctic.500', 'arctic.400', 'arctic.300', 'arctic.200']);
  return (
    <SVG
      className={classes('arctic-heatmap', className)}
      panelColors={{
        0: a0,
        2: a2,
        4: a4,
        10: a10,
        20: a20,
        30: a30
      }}
      rectSize={14} width='100%' rectRender={(props, data) => (
        <Tooltip label={`${data.count || 0} problems`} placement='top'>
          <rect {...props} rx={5} />
        </Tooltip>
      )} legendRender={props => (
        <rect {...props} rx={5} />
      )} legendCellSize={12} {...props} />
  );
}
