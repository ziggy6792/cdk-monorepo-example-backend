/* eslint-disable camelcase */
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

export interface MyContext {
    req: any | null;
    identity: ICognitoIdentity | null;
}
