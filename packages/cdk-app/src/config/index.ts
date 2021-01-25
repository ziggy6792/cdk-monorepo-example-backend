/* eslint-disable import/prefer-default-export */
export const PROJECT_NAME = 'cdk-monorepo-backend';
export const AWS_ACCOUNT_ID = '932244219675';
export const AWS_REGION = 'ap-southeast-1';

export const DEPLOYMENT_CONFIG = {
    staging: {
        domainPrefix: `monorepo-staging`,
        facebookClientId: '2655230284789320',
        facebookClientSecret: '735671e92e39d55958f27e3def6e6e65',
    },
    prod: {
        domainPrefix: `monorepo-prod`,
        facebookClientId: '153415723229752',
        facebookClientSecret: '8d373404c59caf111fe055f6e9deeb15',
    },
    dummy: {
        domainPrefix: `monorepo-dummy`,
        facebookClientId: '153415723229752',
        facebookClientSecret: '8d373404c59caf111fe055f6e9deeb15',
    },
};
