import * as envConfig from 'src/config/get-env-config';
import TEST_AWS_CONFIG from './config';

// Ignore what is set in config and force test env config
jest.spyOn(envConfig, 'default').mockReturnValue({
    env: envConfig.EnvType.TEST,
    awsConfig: TEST_AWS_CONFIG,
});
