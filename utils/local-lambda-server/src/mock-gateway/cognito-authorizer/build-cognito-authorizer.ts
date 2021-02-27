/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import express from 'express';
import buildIamAuthorizedEvent from 'src/mock-gateway/build-authd-event';
import { ICognitoIdentity, ExpressMiddleware } from 'src/mock-gateway/types';
import getJwk from './services/get-jwk';
import jwtUtil from './jwt-util';

// let jwk: IJwk;

export const buildCognitoAutorizer = async (userPoolId: string | null, region = 'ap-southeast-1'): Promise<ExpressMiddleware> => {
    const jwk = userPoolId ? await getJwk(region, userPoolId) : null;

    return function (req, res, next): void {
        console.log('Authorization', req.headers.authorization);

        const { headers } = req;
        const jwtToken = headers.authorization;

        console.log('token', jwtToken);
        console.log('COGNITO_USER_POOL_ID', userPoolId);
        console.log('REGION', region);

        let identity: ICognitoIdentity | null = null;

        if (jwtToken) {
            identity = userPoolId ? jwtUtil.verifyJwt(jwk, jwtToken) : jwtUtil.decodeJwt(jwtToken);

            console.log('identity', identity);
        }
        const event = buildIamAuthorizedEvent(identity);

        req.headers['x-apigateway-event'] = encodeURIComponent(JSON.stringify(event));

        next();
    };
};
export default buildCognitoAutorizer;
