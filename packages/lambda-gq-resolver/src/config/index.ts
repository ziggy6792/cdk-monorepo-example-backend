// From env
export const ENV = process.env.ENV || 'staging';
export const REGION = process.env.REGION || 'ap-southeast-1';
console.log('ENV', ENV);
export const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || 'ap-southeast-1_eLTcaObre';

// Others
export const IS_PROD = ENV === 'prod';
export const TABLE_NAME_PREFIX = `cdk-monorepo-${ENV}-`;

console.log('TABLE_NAME_PREFIX', TABLE_NAME_PREFIX);
