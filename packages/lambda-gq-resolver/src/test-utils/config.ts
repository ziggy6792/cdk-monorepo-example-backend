import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

const TEST_AWS_CONFIG: ServiceConfigurationOptions = {
    region: 'local',
    endpoint: 'http://localhost:4566',
    httpOptions: {
        timeout: 3000,
    },
};

export default TEST_AWS_CONFIG;
