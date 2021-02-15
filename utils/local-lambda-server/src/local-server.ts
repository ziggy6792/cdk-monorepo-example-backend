/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import express from 'express';
import { createApolloServer } from '@simonverhoeven/lambda-gq-resolver';
import config from 'src/config';
import buildCognitoAutorizer from './mock-gateway/cognito-authorizer';

import buildIamAutorizer from './mock-gateway/iam-authozier';
// import { cognitoAutorizer } from './mock-gateway/cognito-authorizer';
// eslint-disable-next-line import/order
import lambdaLocal = require('lambda-local');

const buildLocalServer = async () => {
    const app = express();

    // Setup local grapql server

    const apolloServer = createApolloServer();

    let gqPath = '/lambda-gq-resolver/auth-user/graphql';

    app.use(gqPath, await buildCognitoAutorizer(config.USER_POOL_ID));
    apolloServer.applyMiddleware({ app, path: gqPath });

    gqPath = '/lambda-gq-resolver/auth-role/graphql';

    app.use(gqPath, await buildIamAutorizer());
    apolloServer.applyMiddleware({ app, path: gqPath });

    gqPath = '/lambda-gq-resolver/auth-none/graphql';

    apolloServer.applyMiddleware({ app, path: gqPath });

    app.use(express.text());

    app.use('/lambda-user-confirmed', async (req, res) => {
        const result = await lambdaLocal.execute({
            lambdaPath: require.resolve('@simonverhoeven/lambda-user-confirmed'),
            lambdaHandler: 'handler',
            envfile: path.join(__dirname, '.env-local'),
            event: {
                headers: req.headers, // Pass on request headers
                body: req.body, // Pass on request body
            },
        });

        res.status((result as any).statusCode)
            .set((result as any).headers)
            .end((result as any).body);
    });

    app.use('/lambda-a', async (req, res) => {
        const result = await lambdaLocal.execute({
            lambdaPath: require.resolve('@simonverhoeven/lambda-a'),
            lambdaHandler: 'handler',
            envfile: path.join(__dirname, '.env-lambda'),
            event: {
                headers: req.headers, // Pass on request headers
                body: req.body, // Pass on request body
            },
        });

        res.status((result as any).statusCode)
            .set((result as any).headers)
            .end((result as any).body);
    });

    app.use('/lambda-b', async (req, res) => {
        const result = await lambdaLocal.execute({
            lambdaPath: require.resolve('@simonverhoeven/lambda-b'),
            lambdaHandler: 'handler',
            envfile: path.join(__dirname, '.env-lambda'),
            event: {
                headers: req.headers, // Pass on request headers
                body: req.body, // Pass on request body
            },
        });

        res.status((result as any).statusCode)
            .set((result as any).headers)
            .end((result as any).body);
    });

    const port = 3100;

    app.listen(port, () => console.log(`listening on port: ${port}`));
};

export default buildLocalServer;
