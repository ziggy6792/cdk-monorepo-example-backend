import getEnvConfig from 'src/config/get-env-config';
import { commonUtils } from '@alpaca-backend/common';

const envConig = getEnvConfig();

export const VALUE = {
    NULL: 'NULL',
};

export const valueIsNull = (value: any): boolean => value === null || value === undefined || value === VALUE.NULL;

export const getTableName = (tableName: string): string => {
    const ret = commonUtils.getTableName(tableName, envConig.env);
    return ret;
};

export const mapDbException = (err: any, message: string): Error => {
    if (err?.code === 'ConditionalCheckFailedException') {
        return new Error(message);
    }
    return err;
};
