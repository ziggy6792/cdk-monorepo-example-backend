import moment from 'src/utils/moment';

export default function getUniqueTimestamp(): string {
    let date = Date.now();

    // If created at same millisecond as previous
    if (date <= getUniqueTimestamp.previous) {
        date = ++getUniqueTimestamp.previous;
    } else {
        getUniqueTimestamp.previous = date;
    }

    return moment(date).toISOString();
}

getUniqueTimestamp.previous = 0;
