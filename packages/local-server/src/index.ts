import path from 'path';
import express from 'express';

import lambdaLocal from 'lambda-local';

const buildLocalServer = async () => {
  const app = express();

  // Setup local grapql server

  app.use(express.text());

  app.use('/lambda-user-confirmed', async (req, res) => {
    const result = await lambdaLocal.execute({
      lambdaPath: path.join(__dirname, '../packages/lambda-user-confirmed/dist/index'),
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
      lambdaPath: path.join(__dirname, '../packages/lambda-a/dist/index'),
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
      lambdaPath: path.join(__dirname, '../packages/lambda-b/dist/index'),
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
buildLocalServer();

module.exports = {};

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
