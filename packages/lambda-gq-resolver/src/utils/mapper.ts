/* eslint-disable prefer-const */
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';

import getEnvConfig from 'src/config/get-env-config';

// eslint-disable-next-line import/no-mutable-exports
export let mapper: DataMapper;

const { awsConfig } = getEnvConfig();

export const initMapper = (): void => {
    mapper = new DataMapper({
        client: new DynamoDB(awsConfig), // the SDK client used to execute operations
        // tableNamePrefix: config.TABLE_NAME_PREFIX, // optionally, you can provide a table prefix to keep your dev and prod tables separate
    });
};
