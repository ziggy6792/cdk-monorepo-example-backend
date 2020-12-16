/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import express from 'express';
import iamAuthorizedEvent from './mock-event';
import getJwk from './services/get-jwk';
import verifyJwt, { ICognitoIdentity, IJwk } from './verify-jwt';

// let jwk: IJwk;

type ExpressMiddleware = (req: express.Request, res: express.Response, next: () => void) => void;

export const cognitoAutorizer = async (userPoolId: string, region = 'ap-southeast-1'): Promise<ExpressMiddleware> => {
  const jwk = await getJwk(region, userPoolId);
  return function (req, res, next): void {
    console.log('authorization', req.headers.authorization);
    req.headers['x-apigateway-event'] = encodeURIComponent(JSON.stringify(iamAuthorizedEvent));

    const { headers } = req;
    const jwtToken = headers.authorization;

    console.log('token', jwtToken);
    console.log('COGNITO_USER_POOL_ID', userPoolId);
    console.log('REGION', region);

    let identity: ICognitoIdentity | null = null;

    if (jwtToken) {
      identity = verifyJwt(jwk, jwtToken);

      console.log('identity', identity);
    }

    next();
  };
};
export default cognitoAutorizer;
