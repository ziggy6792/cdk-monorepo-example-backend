/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createApolloServer } from '../packages/lambda-gq-resolver/src/index';
import cognitoAutorizer from './mock-gateway/cognito-authorizer';
// import { cognitoAutorizer } from './mock-gateway/cognito-authorizer';
// eslint-disable-next-line import/order
import lambdaLocal = require('lambda-local');

const app = express();

// Setup local grapql server

const apolloServer = createApolloServer();

const localGqPath = '/lambda-gq-resolver/graphql';

const buidLocalServer = async () => {
  app.use(localGqPath, await cognitoAutorizer('ap-southeast-1_5zmaTsBgU'));
  apolloServer.applyMiddleware({ app, path: localGqPath });

  app.use(express.text());

  app.use('/lambda-user-confirmed', async (req, res) => {
    const result = await lambdaLocal.execute({
      lambdaPath: path.join(__dirname, '../packages/lambda-user-confirmed/src/index'),
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
      lambdaPath: path.join(__dirname, '../packages/lambda-a/src/index'),
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

  app.use('/lambda-b', async (req, res) => {
    const result = await lambdaLocal.execute({
      lambdaPath: path.join(__dirname, '../packages/lambda-b/src/index'),
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
  const port = 3100;

  app.listen(port, () => console.log(`listening on port: ${port}`));
};
buidLocalServer();

// Setup gateway services

// app.use('/lambda-gq-resolver/graphql', async (req, res) => {
//   // console.log('req', JSON.stringify(req));
//   const result = await lambdaLocal.execute({
//     lambdaPath: path.join(__dirname, '../packages/lambda-gq-resolver/src/index'),
//     lambdaHandler: 'handler',
//     envfile: path.join(__dirname, '.env-lambda'),
//     event: mapToGatewayEvent(req),
//   });

//   res
//     .status((result as any).statusCode)
//     .set((result as any).headers)
//     .end((result as any).body);
// });
