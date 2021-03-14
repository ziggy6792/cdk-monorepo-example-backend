/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable max-len */
/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */
// import { APIGatewayProxyCallback, APIGatewayProxyEvent, Context as LambdaContext } from 'aws-lambda';

import 'reflect-metadata';

import { IContext, ICognitoIdentity, IdentityType, IIamIdentity, IIdentity } from 'src/types';
import getRiderAlocationPostitionLoader from 'src/data-loaders/rider-alocation-position-loader';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getIdentityType = (eventIdentity: any): IdentityType => {
    if (eventIdentity?.username) {
        return IdentityType.USER;
    }
    if (eventIdentity?.userArn) {
        if (eventIdentity.cognitoAuthenticationType === 'unauthenticated') {
            return IdentityType.ROLE_UNAUTH;
        }
        return IdentityType.ROLE;
    }
    return IdentityType.NONE;
};

export const getContextInitialState = (): IContext => ({
    req: null,
    identity: null,
    dataLoaders: { riderAlocationPosition: getRiderAlocationPostitionLoader() },
});

const context = async (recieved: any): Promise<IContext> => {
    const { req } = recieved;

    const exentHeader = req.headers['x-apigateway-event'];

    const event = exentHeader ? JSON.parse(decodeURIComponent(exentHeader)) : null;

    const identityType = getIdentityType(event?.requestContext?.identity);

    let identity: IIdentity;

    switch (identityType) {
        case IdentityType.USER:
            identity = { type: identityType, user: event.requestContext.identity as ICognitoIdentity };
            break;
        case IdentityType.ROLE:
            identity = { type: identityType, role: event.requestContext.identity as IIamIdentity };
            break;
        case IdentityType.ROLE_UNAUTH:
            identity = { type: identityType, role: event.requestContext.identity as IIamIdentity };
            break;
        default:
            identity = { type: identityType };
            break;
    }

    return { ...getContextInitialState(), req, identity };
};

export default context;
