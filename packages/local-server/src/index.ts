import path from 'path';
import express from 'express';
// import lambdaLocal from 'lambda-local';
import lambdaLocal = require('lambda-local');

const app = express();

// Setup local grapql server

// const apolloServer = new ApolloServer({ schema });

app.use(express.text());

app.use('/lambda-a', async (req, res) => {
  console.log(`path is ${path.join(__dirname, '../../lambda-a/dist/index')}`);
  const result = await lambdaLocal.execute({
    lambdaPath: path.join(__dirname, '../../lambda-a/dist/index'),
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
