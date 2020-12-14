// From env
export const REGION = process.env.REGION || 'ap-southeast-1';
export const ENV = process.env.ENV || 'dev';
export const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || 'ap-southeast-1_eLTcaObre';

// Others
export const IS_PROD = ENV === 'prod';
export const TABLE_NAME_PREFIX = IS_PROD ? 'cdk-monorepo-prod-' : 'cdk-monorepo-dev-';
