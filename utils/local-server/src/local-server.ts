/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createApolloServer } from '@danielblignaut/lambda-gq-resolver';
import buildCognitoAutorizer from './mock-gateway/cognito-authorizer';
import cdkExports from './mock-gateway/cdk-exports';
// import { cognitoAutorizer } from './mock-gateway/cognito-authorizer';
// eslint-disable-next-line import/order
import lambdaLocal = require('lambda-local');

const buildLocalServer = async () => {
  const app = express();

  // Setup local grapql server

  const apolloServer = createApolloServer();

  const localGqPath = '/lambda-gq-resolver/graphql';

  app.use(localGqPath, await buildCognitoAutorizer(cdkExports.USER_POOL_ID));
  apolloServer.applyMiddleware({ app, path: localGqPath });

  app.use(express.text());

  app.use('/lambda-user-confirmed', async (req, res) => {
    const result = await lambdaLocal.execute({
      lambdaPath: require.resolve('@danielblignaut/lambda-user-confirmed'),
      lambdaHandler: 'handler',
      envfile: path.join(__dirname, '.env-local'),
      event: {
        headers: req.headers, // Pass on request headers
        body: req.body, // Pass on request body
      },
    });

    res
      .status((result as any).statusCode)
      .set((result as any).headers)
      .end((result as any).body);
  });

  app.use('/lambda-a', async (req, res) => {
    const result = await lambdaLocal.execute({
      lambdaPath: require.resolve('@danielblignaut/lambda-a'),
      lambdaHandler: 'handler',
      envfile: path.join(__dirname, '.env-lambda'),
      event: {
        headers: req.headers, // Pass on request headers
        body: req.body, // Pass on request body
      },
    });

    res
      .status((result as any).statusCode)
      .set((result as any).headers)
      .end((result as any).body);
  });

  app.use('/lambda-b', async (req, res) => {
    const result = await lambdaLocal.execute({
      lambdaPath: require.resolve('@danielblignaut/lambda-b'),
      lambdaHandler: 'handler',
      envfile: path.join(__dirname, '.env-lambda'),
      event: {
        headers: req.headers, // Pass on request headers
        body: req.body, // Pass on request body
      },
    });

    res
      .status((result as any).statusCode)
      .set((result as any).headers)
      .end((result as any).body);
  });

  const port = 3100;

  app.listen(port, () => console.log(`listening on port: ${port}`));
};

export default buildLocalServer;