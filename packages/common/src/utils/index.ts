/* eslint-disable no-restricted-imports */
/* eslint-disable import/prefer-default-export */
import config from '../config';

const getTableName = (tableName: string, stage?: string): string => {
    const contItems = [config.PROJECT_NAME, stage, tableName].filter((v) => v != null);
    return contItems.join('-');
};

export default { getTableName };
