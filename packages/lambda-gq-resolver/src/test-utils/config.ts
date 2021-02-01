import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

const TEST_DB_CONFIG: ServiceConfigurationOptions = {
    region: 'local',
    endpoint: 'http://localhost:8000',
    httpOptions: {
        timeout: 3000,
    },
};

export default TEST_DB_CONFIG;
