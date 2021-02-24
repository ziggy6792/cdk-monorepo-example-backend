import { FunctionExpression, AttributePath, ConditionExpression } from '@aws/dynamodb-expressions';

import getEnvConfig from 'src/config/get-env-config';
import { commonUtils } from '@simonverhoeven/common';

const envConig = getEnvConfig();

export const VALUE = {
    NULL: 'NULL',
};

export const valueIsNull = (value: any): boolean => value === null || value === undefined || value === VALUE.NULL;

export const getTableName = (tableName: string): string => {
    const ret = commonUtils.getTableName(tableName, envConig.env);
    return ret;
};

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

export const mapDbException = (err: any, message: string): any => {
    if (err?.code === 'ConditionalCheckFailedException') {
        return new Error(message);
    }
    return err;
};
