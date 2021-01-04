/* eslint-disable import/prefer-default-export */
export const PROJECT_NAME = 'cdk-monorepo-backend';

export const DEPLOYMENT_CONFIG = {
  staging: {
    domainPrefix: `alpaca-staging`,
    facebookClientId: '401988904382290',
    facebookClientSecret: '56dc78be341d68d0f0e3229a6ee37723',
  },
  prod: {
    domainPrefix: `alpaca-prod`,
    facebookClientId: '401988904382290',
    facebookClientSecret: '56dc78be341d68d0f0e3229a6ee37723',
  },
};
