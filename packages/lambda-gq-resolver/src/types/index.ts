/* eslint-disable camelcase */

import DataLoader from 'dataloader';
import { RiderAllocationKey, RiderAllocationPosition } from 'src/data-loaders/rider-alocation-position-loader';

export enum IdentityType {
    ROLE = 'role',
    USER = 'user',
    ROLE_UNAUTH = 'role_unauth',
    NONE = 'none',
}
export interface IIdentity {
    type: IdentityType;
    user?: ICognitoIdentity;
    role?: IIamIdentity;
}

export interface ICognitoIdentity {
    sub: string;
    'cognito:groups': string;
    token_use: string;
    scope: string;
    auth_time: string;
    iss: string;
    exp: string;
    iat: string;
    version: string;
    jti: string;
    client_id: string;
    username: string;
}

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

export interface IDecodedJWT {
    header: IHeader;
    payload: ICognitoIdentity;
    signature: string;
}
export interface IHeader {
    kid: string;
    alg: string;
}

export interface IEvent {
    identity: ICognitoIdentity;
}

export interface IContext {
    req: any | null;
    identity: IIdentity;
    dataLoaders: {
        riderAlocationPosition: DataLoader<RiderAllocationKey, RiderAllocationPosition>;
    };
}
