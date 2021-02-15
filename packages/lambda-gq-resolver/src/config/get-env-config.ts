import localAwsConfig from '@test-utils/config';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

export enum EnvType {
    STAGING = 'staging',
    PROD = 'prod',
    TEST = 'test',
}

// Point to test (local) or staging (cloud)
const localEnv: EnvType = EnvType.TEST;

const env = (process.env.ENV as EnvType) || localEnv;

const awsConfig: ServiceConfigurationOptions = {
    region: process.env.REGION || 'ap-southeast-1',
};

const envConfig = {
    env,
    awsConfig: localEnv === EnvType.TEST ? localAwsConfig : awsConfig,
};

const getEnvConfig = () => {
    console.log('envConfig', envConfig);
    return envConfig;
};

export default getEnvConfig;
