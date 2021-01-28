/* eslint-disable camelcase */
import express from 'express';

export type ExpressMiddleware = (req: express.Request, res: express.Response, next: () => void) => void;

export interface IIamIdentity {
    cognitoIdentityPoolId: string;
    accountId: string;
    cognitoIdentityId: string;
    caller: string;
    sourceIp: string;
    principalOrgId?: null;
    accessKey: string;
    cognitoAuthenticationType: string;
    cognitoAuthenticationProvider?: null;
    userArn: string;
    userAgent: string;
    user: string;
}

export interface ICognitoIdentity {
    sub: string;
    event_id: string;
    token_use: string;
    scope: string;
    auth_time: number;
    iss: string;
    exp: number;
    iat: number;
    jti: string;
    client_id: string;
    username: string;
}
