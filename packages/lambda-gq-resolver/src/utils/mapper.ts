/* eslint-disable prefer-const */
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { FunctionExpression, AttributePath, ConditionExpression } from '@aws/dynamodb-expressions';

import models from 'src/domain/models';
import getEnvConfig from 'src/config/get-env-config';

// eslint-disable-next-line import/no-mutable-exports
export let mapper: DataMapper;

const { awsConfig } = getEnvConfig();

export const initMapper = (): void => {
    mapper = new DataMapper({
        client: new DynamoDB(awsConfig), // the SDK client used to execute operations
        // tableNamePrefix: config.TABLE_NAME_PREFIX, // optionally, you can provide a table prefix to keep your dev and prod tables separate
    });
    console.log('REGION!');
};

// export const createUniqueCondition = (attributePath = 'id'): FunctionExpression =>
//     new FunctionExpression('attribute_not_exists', new AttributePath(attributePath));

export const createNotExistsCondition = (attributePaths = ['id']): ConditionExpression => {
    const andExpression: ConditionExpression = {
        type: 'And',
        conditions: attributePaths.map((path) => new FunctionExpression('attribute_not_exists', new AttributePath(path))),
    };
    return andExpression;
};

export const createExistsCondition = (attributePaths = ['id']): ConditionExpression => {
    const andExpression: ConditionExpression = {
        type: 'And',
        conditions: attributePaths.map((path) => new FunctionExpression('attribute_exists', new AttributePath(path))),
    };
    return andExpression;
};
