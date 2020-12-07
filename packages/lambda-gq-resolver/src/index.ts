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
import { ApolloServer } from 'apollo-server-lambda';
import {} from 'type-graphql';
import { commonFunctionExample } from '@danielblignaut/common-lambda-lib/dist/utils';

import createSchema from './graph-ql/create-schema';

import { initMapper } from './util/mapper';
import { MyContext } from './types/MyContext';
import verifyJwt, { IJwk } from './util/verify-jwt';
import getJwk from './services/get-jwk';
import { COGNITO_USER_POOL_ID, REGION, TABLE_NAME_PREFIX } from './config/index';

// {"REGION":"ap-southeast-1","ENV":"dev","COGNITO_USER_POOL_ID":"ap-southeast-1_btGS9vGhJ"}

let jwk: IJwk;

export const createServerParams = () => ({
  schema: createSchema(),
  introspection: true,
  playground: true,
  context: async (recieved: { event: any }): Promise<MyContext> => {
    const { event } = recieved;
    const { headers } = event;

    // Not sure why local is sending as lower case header keys and server is sending upper
    const jwtToken = headers.authorization || headers.Authorization;

    console.log('event', JSON.stringify(event));

    console.log('token', jwtToken);
    console.log('COGNITO_USER_POOL_ID', COGNITO_USER_POOL_ID);
    console.log('REGION', REGION);

    if (jwtToken) {
      jwk = jwk || (await getJwk(REGION, COGNITO_USER_POOL_ID));

      event.identity = verifyJwt(jwk, jwtToken);
    }

    // console.log(event.identity);

    return { event };
  },
});

const server = new ApolloServer(createServerParams());

const init = (): void => {
  AWS.config.update({ region: REGION });
  commonFunctionExample();
  initMapper(REGION, TABLE_NAME_PREFIX);
};

init();

export const handler = server.createHandler({ cors: { origin: '*' } });

// export const handler = async (event: APIGatewayProxyEvent, context: LambdaContext, callback: APIGatewayProxyCallback) => {
//   // return apolloServerHandler(event, context, callback);
//   console.log('event', JSON.stringify(event));
//   console.log('*******');
//   console.log('context', JSON.stringify(context));

//   return {
//     statusCode: 200,
//     body: JSON.stringify({
//       success: commonFunctionExample(),
//     }),
//   };
// };
