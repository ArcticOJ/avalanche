import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from 'dayjs';

[
  relativeTime,
  advancedFormat,
  localizedFormat
].forEach(plugin => dayjs.extend(plugin));
