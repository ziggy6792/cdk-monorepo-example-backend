import { commonConfig, commonUtils } from '@simonverhoeven/common';
import getEnvConfig from 'src/config/get-env-config';

const envConig = getEnvConfig();

export const VALUE = {
    NULL: 'NULL',
};

export const valueIsNull = (value: any): boolean => value === null || value === undefined || value === VALUE.NULL;

export const getTableName = (tableName: string): string => commonUtils.getTableName(tableName, envConig.ENV);
