import AWS from 'aws-sdk';
import getEnvConfig from 'src/config/get-env-config';
import clearDb from './clear-db';

const { awsConfig } = getEnvConfig();

const testConn = async (): Promise<void> => {
    AWS.config.update(awsConfig);

    await clearDb();
};

export default testConn;
