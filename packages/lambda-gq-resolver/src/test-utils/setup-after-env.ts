import * as envConfig from 'src/config/get-env-config';

jest.spyOn(envConfig, 'default').mockReturnValue({
    ENV: 'test',
    REGION: 'local',
    COGNITO_USER_POOL_ID: '',
    IS_PROD: false,
    TABLE_NAME_PREFIX: 'test-',
});
