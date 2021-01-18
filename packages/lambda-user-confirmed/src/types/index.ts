/* eslint-disable camelcase */
export interface CognitoPostConfimEvent {
    version: string;
    region: string;
    userPoolId: string;
    userName: string;
    callerContext: CallerContext;
    triggerSource: string;
    request: Request;
    response: any;
}
export interface CallerContext {
    awsSdkVersion: string;
    clientId: string;
}
export interface Request {
    userAttributes: UserAttributes;
}
export interface UserAttributes {
    ['custom:signUpAttributes']: string;
    given_name?: string;
    family_name?: string;
    gender?: string;
    picture?: string;
    sub: string;
    ['cognito:email_alias']: string;
    ['cognito:user_status']: string;
    email_verified: string;
    email: string;
}
