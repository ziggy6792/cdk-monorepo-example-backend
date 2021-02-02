import AWS from 'aws-sdk';
import { initMapper, initTables } from 'src/utils/mapper';
import * as envConfig from 'src/config/get-env-config';
import clearDb from './clear-db';
import TEST_DB_CONFIG from './config';

const testConn = async (): Promise<void> => {
    AWS.config.update(TEST_DB_CONFIG);

    jest.spyOn(envConfig, 'default').mockReturnValue({
        ENV: 'test',
        REGION: 'local',
        COGNITO_USER_POOL_ID: '',
        IS_PROD: false,
        TABLE_NAME_PREFIX: 'test-',
    });

    initMapper();

    await clearDb();
    await initTables();
};

export default testConn;
