import 'reflect-metadata';
import * as envConfig from 'src/config/get-env-config';
import localAwsConfig from './config';

// Ignore what is set in config and force test env config
jest.spyOn(envConfig, 'default').mockReturnValue({
    env: envConfig.EnvType.TEST,
    awsConfig: localAwsConfig,
});

jest.setTimeout(60000);
