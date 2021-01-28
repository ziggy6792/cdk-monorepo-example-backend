/* eslint-disable import/no-extraneous-dependencies */
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { handler } from './index';

import * as api from './services/gql-api';

import * as config from './config';

AWSMock.setSDKInstance(AWS);

AWSMock.mock('CognitoIdentityServiceProvider', 'adminUpdateUserAttributes', (params, cb) => {
    console.log('adminUpdateUserAttributes called with', params);
    cb(null);
});

AWSMock.mock('CognitoIdentityServiceProvider', 'getGroup', (params, cb) => {
    console.log('getGroup called with', params);
    cb(null);
});

AWSMock.mock('CognitoIdentityServiceProvider', 'createGroup', (params, cb) => {
    console.log('createGroup called with', params);
    cb(null);
});

AWSMock.mock('CognitoIdentityServiceProvider', 'adminAddUserToGroup', (params, cb) => {
    console.log('adminAddUserToGroup called with', params);
    cb(null);
});

process.env.SSM_LAMBDA_CONFIG = '/cdk-monorepo-backend/staging/lambda-config';

jest.spyOn(config, 'loadConfig').mockResolvedValue();

const connfirmSignupEvent = {
    version: '1',
    region: 'ap-southeast-1',
    userPoolId: 'ap-southeast-1_5zmaTsBgU',
    userName: '13b0d16f-74dd-4c88-b4dd-53927f8ef0de',
    callerContext: {
        awsSdkVersion: 'aws-sdk-unknown-unknown',
        clientId: '3cegk98tmu5kqtl2jhg1jlcl0',
    },
    triggerSource: 'PostConfirmation_ConfirmSignUp',
    request: {
        userAttributes: {
            'custom:signUpAttributes': '{"given_name":"Simon","family_name":"Verhoeven"}',
            sub: '13b0d16f-74dd-4c88-b4dd-53927f8ef0de',
            'cognito:email_alias': 'ziggy067+1@gmail.com',
            'cognito:user_status': 'CONFIRMED',
            email_verified: 'true',
            email: 'ziggy067+1@gmail.com',
        },
    },
    response: {},
};

describe('test lambda-user-confirmed', () => {
    jest.spyOn(api, 'registerUser').mockResolvedValue(true);

    test('successfull', async () => {
        const mockCallback = jest.fn();

        process.env.AWS_REGION = 'ap-southeast-1';

        const actualResult = await handler(connfirmSignupEvent, {} as undefined, mockCallback);

        const expectedResult = {
            version: '1',
            region: 'ap-southeast-1',
            userPoolId: 'ap-southeast-1_5zmaTsBgU',
            userName: '13b0d16f-74dd-4c88-b4dd-53927f8ef0de',
            callerContext: {
                awsSdkVersion: 'aws-sdk-unknown-unknown',
                clientId: '3cegk98tmu5kqtl2jhg1jlcl0',
            },
            triggerSource: 'PostConfirmation_ConfirmSignUp',
            request: {
                userAttributes: {
                    sub: '13b0d16f-74dd-4c88-b4dd-53927f8ef0de',
                    'cognito:email_alias': 'ziggy067+1@gmail.com',
                    'cognito:user_status': 'CONFIRMED',
                    email_verified: 'true',
                    email: 'ziggy067+1@gmail.com',
                    given_name: 'Simon',
                    family_name: 'Verhoeven',
                },
            },
            response: {},
        };

        expect(actualResult).toEqual(expectedResult);
    });
});
