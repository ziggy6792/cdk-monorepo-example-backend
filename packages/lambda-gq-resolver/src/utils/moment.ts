import moment from 'moment-timezone';

moment.tz.setDefault('Asia/Singapore');

moment.defaultFormat = 'ddd DD MMM HH:mm';

export default moment;
