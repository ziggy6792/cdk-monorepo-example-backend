/* eslint-disable no-restricted-imports */
/* eslint-disable import/prefer-default-export */
import config from 'src/config';

const getTableName = (tableName: string, stage?: string): string => {
    const contItems = [config.PROJECT_NAME, stage, 'v2', tableName].filter((v) => v != null);
    return contItems.join('-');
};

export default { getTableName };
