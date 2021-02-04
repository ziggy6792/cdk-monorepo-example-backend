// From env
const ENV = process.env.ENV || 'staging';
const REGION = process.env.REGION || 'ap-southeast-1';
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || 'ap-southeast-1_eLTcaObre';

// Others
const IS_PROD = ENV === 'prod';

const env = {
    ENV,
    REGION,
    COGNITO_USER_POOL_ID,
    IS_PROD,
};

const getEnvConfig = () => env;

export default getEnvConfig;
