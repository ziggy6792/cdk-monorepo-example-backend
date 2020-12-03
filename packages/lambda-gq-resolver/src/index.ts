/* eslint-disable no-var */
/* eslint-disable class-methods-use-this */
// /* eslint-disable class-methods-use-this */
// /* eslint-disable import/prefer-default-export */

import 'reflect-metadata';
import AWS from 'aws-sdk';
import { ApolloServer } from 'apollo-server-lambda';
// import { APIGatewayProxyCallback, APIGatewayProxyEvent, Context as LambdaContext } from 'aws-lambda';
import {} from 'type-graphql';
import createSchema from './graph-ql/create-schema';
import { REGION, TABLE_NAME_PREFIX } from './config/index';
import { initMapper, initTables } from './util/mapper';

export const serverParams = {
  schema: createSchema(),
  introspection: true,
  playground: true,
  context: async (): Promise<void> => {
    // console.log('create');
    await initTables();
  },
};

const server = new ApolloServer(serverParams);

export const init = (): void => {
  AWS.config.update({ region: REGION });

  initMapper(REGION, TABLE_NAME_PREFIX);
};

init();

export const handler = server.createHandler();

// exports.handler = async (event: APIGatewayProxyEvent, context: LambdaContext, callback: APIGatewayProxyCallback) => {
//   return apolloServerHandler(event, context, callback);
// };
