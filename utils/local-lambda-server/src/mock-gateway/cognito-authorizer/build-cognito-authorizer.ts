/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { buildCognitoAuthorizedEvent } from 'src/mock-gateway/build-authd-event';
import { ICognitoIdentity, ExpressMiddleware } from 'src/mock-gateway/types';
import getJwk from './services/get-jwk';
import jwtUtil from './jwt-util';

// let jwk: IJwk;

export const buildCognitoAutorizer = async (userPoolId: string | null, region = 'ap-southeast-1'): Promise<ExpressMiddleware> => {
    const jwk = userPoolId ? await getJwk(region, userPoolId) : null;

    return function (req, res, next): void {
        const { headers } = req;
        const jwtToken = headers.authorization;

        console.log('token', jwtToken);
        console.log('COGNITO_USER_POOL_ID', userPoolId);

        let identity: ICognitoIdentity | null = null;

        if (req.method === 'POST' && !jwtToken) {
            throw new Error('Local Cognito Authorizer: no authozation header provided');
        }

        if (jwtToken) {
            identity = userPoolId ? jwtUtil.verifyJwt(jwk, jwtToken) : jwtUtil.decodeJwt(jwtToken);

            console.log('identity', identity);
            if (!identity) {
                throw new Error('Local Cognito Authorizer: could not authenticate');
            }
        }

        const event = buildCognitoAuthorizedEvent(identity);

        req.headers['x-apigateway-event'] = encodeURIComponent(JSON.stringify(event));

        next();
    };
};
export default buildCognitoAutorizer;
