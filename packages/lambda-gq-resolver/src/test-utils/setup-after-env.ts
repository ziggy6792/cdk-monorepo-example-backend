import * as envConfig from 'src/config/get-env-config';

jest.spyOn(envConfig, 'default').mockReturnValue({
    ENV: 'test',
    REGION: 'local',
    IS_PROD: false,
});
