import * as config from './common-config';
import * as dbSchema from './db-schema';

const commonConfig = {
    ...config,
    ...dbSchema,
};

export default commonConfig;
