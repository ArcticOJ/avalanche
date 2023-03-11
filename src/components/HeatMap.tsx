import '@uiw/react-heat-map/dist/heat-map.min.css';
import ReactHeatMap, {HeatMapProps} from '@uiw/react-heat-map';
import {Tooltip} from '@chakra-ui/react';
import React from 'react';

export default function HeatMap(props: HeatMapProps) {
  return (
    <ReactHeatMap rectSize={14} rectRender={(props, data) => (
      <Tooltip label={`count ${data.count}`} placement='top'>
        <rect {...props} rx={5} />
      </Tooltip>
    )} legendRender={props => (
      <rect {...props} rx={5} />
    )} legendCellSize={12} {...props} />
  );
}
