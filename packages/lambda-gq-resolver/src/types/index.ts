/* eslint-disable camelcase */

export enum IdentityType {
    ROLE = 'role',
    USER = 'user',
    ROLE_UNAUTH = 'role_unauth',
}
export interface IIdentity {
    type: IdentityType;
    user?: ICognitoIdentity;
    role?: IIamIdentity;
}
export interface ICognitoIdentity {
    sub?: string;
    event_id?: string;
    token_use?: string;
    scope?: string;
    auth_time: number;
    iss?: string;
    exp: number;
    iat: number;
    jti?: string;
    client_id?: string;
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

export interface Context {
    req: any | null;
    identity: IIdentity;
}
