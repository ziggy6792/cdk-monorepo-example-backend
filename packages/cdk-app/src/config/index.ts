import { commonConfig } from '@alpaca-backend/common';
/* eslint-disable import/prefer-default-export */
export const AWS_REGION = 'ap-southeast-1';
export const AWS_ACCOUNT_ID = '932244219675';

export const DEPLOYMENT_CONFIG = {
    staging: {
        domainPrefix: `${commonConfig.PROJECT_NAME}-staging`,
        facebookClientId: '401988904382290',
        facebookClientSecret: '56dc78be341d68d0f0e3229a6ee37723',
    },
    prod: {
        domainPrefix: `${commonConfig.PROJECT_NAME}-prod`,
        facebookClientId: '436274460940204',
        facebookClientSecret: '179eed5d79443650d23853c779ad6c11',
    },
    dummy: {
        domainPrefix: `${commonConfig.PROJECT_NAME}-dummy`,
        facebookClientId: '401988904382290',
        facebookClientSecret: '56dc78be341d68d0f0e3229a6ee37723',
    },
};
