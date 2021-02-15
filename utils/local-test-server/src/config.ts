/* eslint-disable import/no-extraneous-dependencies */
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

export const TEST_DB_CONFIG: ServiceConfigurationOptions = {
    region: 'local',
    endpoint: 'http://localhost:4566',
    httpOptions: {
        timeout: 3000,
    },
};

const LOCAL_STACK_CONFIG = {
    checkHealthEndpoint: 'http://localhost:4566/health',
    readyResponse: {
        services: {
            dynamodbstreams: 'running',
            iam: 'running',
            sts: 'running',
            kinesis: 'running',
            s3: 'running',
            ssm: 'running',
            cloudformation: 'running',
            dynamodb: 'running',
        },
    },
};

export default LOCAL_STACK_CONFIG;
