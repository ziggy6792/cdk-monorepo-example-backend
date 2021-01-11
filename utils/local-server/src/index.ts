import path from 'path';
import express from 'express';
// import lambdaLocal from 'lambda-local';
import lambdaLocal = require('lambda-local');

const app = express();

// Setup local grapql server

// const apolloServer = new ApolloServer({ schema });

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

console.log(`lambda a path is ${require.resolve('@danielblignaut/lambda-a')}`);

app.listen(port, () => console.log(`listening on port: ${port}`));
