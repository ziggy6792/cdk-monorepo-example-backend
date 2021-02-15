import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

const localAwsConfig: ServiceConfigurationOptions = {
    region: 'local',
    endpoint: 'http://localhost:4566',
    httpOptions: {
        timeout: 3000,
    },
};

export default localAwsConfig;
