/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable max-len */
/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */
// import { APIGatewayProxyCallback, APIGatewayProxyEvent, Context as LambdaContext } from 'aws-lambda';

import 'reflect-metadata';
import AWS from 'aws-sdk';
import { ApolloServer } from 'apollo-server-express';
import * as serverless from 'aws-serverless-express';
import Express from 'express';
import { commonFunctionExample } from '@danielblignaut/common-lambda-lib/dist/utils';

import * as util from 'util';
import createSchema from './graph-ql/create-schema';

import { initMapper } from './util/mapper';
import { MyContext } from './types/MyContext';

import getJwk from './services/get-jwk';
import { COGNITO_USER_POOL_ID, REGION, TABLE_NAME_PREFIX } from './config/index';
import verifyJwt, { ICognitoIdentity, IJwk } from './util/verify-jwt';

let jwk: IJwk;

export const createApolloServer = (): ApolloServer => {
  return new ApolloServer({
    schema: createSchema(),
    introspection: true,
    playground: true,
    context: async (recieved: any): Promise<MyContext> => {
      console.log('recieved', util.inspect(recieved));

      const { req } = recieved;
      const { headers } = req;
      const jwtToken = headers.authorization;

      console.log('token', jwtToken);
      console.log('COGNITO_USER_POOL_ID', COGNITO_USER_POOL_ID);
      console.log('REGION', REGION);

      let identity: ICognitoIdentity | null = null;

      if (jwtToken) {
        jwk = jwk || (await getJwk(REGION, COGNITO_USER_POOL_ID));
        identity = verifyJwt(jwk, jwtToken);
      }

      return { req, identity };
    },
  });
};

// Init
AWS.config.update({ region: REGION });
const app = Express();
const apolloServer = createApolloServer();
apolloServer.applyMiddleware({ app });
const server = serverless.createServer(app);
commonFunctionExample();
initMapper(REGION, TABLE_NAME_PREFIX);

export const handler = (event, context) => {
  return serverless.proxy(server, event, context);
};
