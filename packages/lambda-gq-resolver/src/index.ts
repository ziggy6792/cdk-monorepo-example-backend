/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */

import 'reflect-metadata';
import AWS from 'aws-sdk';
import { ApolloServer } from 'apollo-server-lambda';
import { APIGatewayProxyCallback, APIGatewayProxyEvent, Context as LambdaContext } from 'aws-lambda';
import {} from 'type-graphql';
import { commonFunctionExample } from '@danielblignaut/common-lambda-lib/dist/utils';
import createSchema from './graph-ql/create-schema';
import { REGION, TABLE_NAME_PREFIX } from './config/index';
import { initMapper, initTables } from './util/mapper';
import { MyContext } from './types/MyContext';

export const createServerParams = () => ({
  schema: createSchema(),
  introspection: true,
  playground: true,
  context: async (recieved: { event: any }): Promise<MyContext> => {
    // console.log('recieved', JSON.stringify(recieved));

    const { event } = recieved;
    await initTables();
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

export const handler = server.createHandler();

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
