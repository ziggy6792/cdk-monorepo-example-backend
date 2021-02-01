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
import createSchema from './graph-ql/create-schema';

import { initMapper, initTables } from './utils/mapper';
import { Context, ICognitoIdentity, IdentityType, IIamIdentity, IIdentity } from './types';

import { REGION, TABLE_NAME_PREFIX } from './config/env';

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
    return null;
};

const context = async (recieved: any): Promise<Context> => {
    await initTables();

    const { req } = recieved;

    const exentHeader = req.headers['x-apigateway-event'];

    const event = exentHeader ? JSON.parse(decodeURIComponent(exentHeader)) : null;

    const identityType = getIdentityType(event.requestContext?.identity);

    let identity: IIdentity;

    switch (identityType) {
        case IdentityType.USER:
            identity = { type: identityType, user: event.requestContext.identity as ICognitoIdentity };
            break;
        case IdentityType.ROLE:
            identity = { type: identityType, role: event.requestContext.identity as IIamIdentity };
            break;
        case IdentityType.ROLE_UNAUTH:
            identity = { type: identityType };
            break;
        default:
            console.log('Auth type not found');
            throw new Error('Auth type not found');
    }

    return { req, identity };
};

export const createApolloServer = (): ApolloServer =>
    new ApolloServer({
        schema: createSchema(),
        introspection: true,
        playground: true,
        context: async (recieved: any): Promise<Context> => {
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
