import AWS from 'aws-sdk';
import getEnvConfig from 'src/config/get-env-config';
import * as mockDb from '@test-utils/mock-db/db';
import clearDb from './clear-db';
import mockDbUtils from './mock-db/mock-db-utils';

const { awsConfig } = getEnvConfig();

const testConn = async (): Promise<void> => {
    AWS.config.update(awsConfig);

    await clearDb();
    await mockDbUtils.populateDb(mockDb.defaultDb);
};

export default testConn;
