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
import { commonFunctionExample } from '@simonverhoeven/common-lambda-lib/dist/utils';

import cors from 'cors';
import createSchema from './typegraphql-setup/create-schema';
import context from './typegraphql-setup/context';

import { initMapper } from './utils/mapper';
import { IContext } from './types';

import { REGION, TABLE_NAME_PREFIX } from './config/env';

export const createApolloServer = (): ApolloServer =>
    new ApolloServer({
        schema: createSchema(),
        introspection: true,
        playground: true,
        context: async (recieved: any): Promise<IContext> => {
            try {
                return context(recieved);
            } catch (err) {
                console.log(err);
                throw err;
            }
        },
    });

// Init
AWS.config.update({ region: REGION });
const app = Express();
app.use(cors({ allowedHeaders: '*', origin: '*', methods: '*' }));
const apolloServer = createApolloServer();
apolloServer.applyMiddleware({ app });

apolloServer.applyMiddleware({ app, path: '*' });

const server = serverless.createServer(app);
commonFunctionExample();
initMapper({ region: REGION, tableNamePrefix: TABLE_NAME_PREFIX });

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
