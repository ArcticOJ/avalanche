import type {ChartTypeRegistry} from 'chart.js';

declare module 'chart.js' {
  interface ChartTypeRegistry {
    rating: ChartTypeRegistry['scatter'];
  }
}
