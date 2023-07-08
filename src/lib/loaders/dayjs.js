import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import dayjs from 'dayjs';

[
  relativeTime,
  advancedFormat
].forEach(plugin => dayjs.extend(plugin));
