const LOCAL_ENV = 'dummy';

//  env
const ENV = process.env.ENV || LOCAL_ENV;
const REGION = process.env.REGION || 'ap-southeast-1';

// Others
const IS_PROD = ENV === 'prod';

const env = {
    ENV,
    REGION,
    IS_PROD,
};

const getEnvConfig = () => env;

export default getEnvConfig;
