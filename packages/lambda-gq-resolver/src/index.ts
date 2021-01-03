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

import cors from 'cors';
import createSchema from './graph-ql/create-schema';

import { initMapper, initTables } from './util/mapper';
import { MyContext } from './types/MyContext';

import { REGION, TABLE_NAME_PREFIX } from './config/index';

export const createApolloServer = (): ApolloServer => {
  return new ApolloServer({
    schema: createSchema(),
    introspection: true,
    playground: true,
    context: async (recieved: any): Promise<MyContext> => {
      // console.log('recieved', util.inspect(recieved));
      await initTables();

      const { req } = recieved;

      const exentHeader = req.headers['x-apigateway-event'];

      const event = exentHeader ? JSON.parse(decodeURIComponent(exentHeader)) : null;

      console.log('Recieved event', event);

      return { req, identity: event.requestContext?.identity };
    },
  });
};

// Init
AWS.config.update({ region: REGION });
const app = Express();
app.use(cors({ allowedHeaders: '*', origin: '*', methods: '*' }));
const apolloServer = createApolloServer();
apolloServer.applyMiddleware({ app });

apolloServer.applyMiddleware({ app, path: '*' });

const server = serverless.createServer(app);
commonFunctionExample();
initMapper(REGION, TABLE_NAME_PREFIX);

export const handler = (event, context) => {
  const logText = `
  partialConnection.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || '${process.env.AWS_ACCESS_KEY_ID}';
  partialConnection.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '${process.env.AWS_SECRET_ACCESS_KEY}';
  partialConnection.AWS_SESSION_TOKEN =
    process.env.AWS_SESSION_TOKEN ||
    // eslint-disable-next-line max-len
    '${process.env.AWS_SESSION_TOKEN}' `;

  console.log(logText);
  // console.log('env', process.env);
  return serverless.proxy(server, event, context);
};
