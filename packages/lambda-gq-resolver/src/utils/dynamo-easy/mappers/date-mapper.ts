/* eslint-disable max-classes-per-file */
import { MapperForType, StringAttribute } from '@shiftcoders/dynamo-easy';

import { parseISO } from 'date-fns';

const valueToIsoString = (value: Date | string): string => {
    if (typeof value === 'string') {
        parseISO(value);
        return value;
    }
    if ((value as Date).toISOString) {
        return (value as Date).toISOString();
    }
    throw new Error(`Could not map ${JSON.stringify(value)} to date`);
};

const dateMapper: MapperForType<Date | string, StringAttribute> = {
    fromDb: (attributeValue) => parseISO(attributeValue.S),
    toDb: (propertyValue) => ({ S: valueToIsoString(propertyValue) }),
    // The values could be isoString if coming from the test db json
    // toDb: (propertyValue) => ({ S: propertyValue.toISOString() }),
};

export default dateMapper;
