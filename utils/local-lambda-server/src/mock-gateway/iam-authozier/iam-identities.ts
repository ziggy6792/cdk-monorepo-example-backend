import { IIamIdentity } from 'src/mock-gateway/types';

export const unauthenticatedUserPoolIdentity: IIamIdentity = {
    cognitoIdentityPoolId: 'ap-southeast-1:6ef41744-b964-4324-a6f5-9a510e99ef28',
    accountId: '932244219675',
    cognitoIdentityId: 'ap-southeast-1:1412aab6-c1bc-43df-9892-d00ef6f31567',
    caller: 'AROA5SDQV44NUGYDU2NKQ:CognitoIdentityCredentials',
    sourceIp: '103.6.151.248',
    principalOrgId: null,
    accessKey: 'ASIA5SDQV44N2XXCYGX7',
    cognitoAuthenticationType: 'unauthenticated',
    cognitoAuthenticationProvider: null,
    userArn: 'arn:aws:sts::932244219675:assumed-role/cdk-monorepo-backend-stag-cdkmonorepobackendidenti-1485D8JDXH705/CognitoIdentityCredentials',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36',
    user: 'AROA5SDQV44NUGYDU2NKQ:CognitoIdentityCredentials',
};

export const lambdaRoleIdentity: IIamIdentity = {
    cognitoIdentityPoolId: null,
    accountId: '932244219675',
    cognitoIdentityId: null,
    caller: 'AROA5SDQV44NYYHED7A4N:cdk-monorepo-backend-user-confirmed-staging',
    sourceIp: '54.254.249.82',
    principalOrgId: null,
    accessKey: 'ASIA5SDQV44NTZHSQNUY',
    cognitoAuthenticationType: null,
    cognitoAuthenticationProvider: null,
    userArn:
        'arn:aws:sts::932244219675:assumed-role/cdk-monorepo-backend-stag-cdkmonorepobackenduserco-NMHY7FLZF98E/cdk-monorepo-backend-user-confirmed-staging',
    userAgent: 'axios/0.19.2',
    user: 'AROA5SDQV44NYYHED7A4N:cdk-monorepo-backend-user-confirmed-staging',
};
