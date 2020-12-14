/* eslint-disable import/prefer-default-export */
import 'source-map-support/register';
import { ApolloClient } from 'apollo-client';
import { createHttpLink, HttpLink } from 'apollo-link-http';
import url from 'url';
import aws4 from 'aws4';

import axios from 'axios';
import { aws4Interceptor } from 'aws4-axios';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import fetch from 'node-fetch';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildAxiosFetch } = require('@lifeomic/axios-fetch');

const interceptor = aws4Interceptor(
  {
    region: 'ap-southeast-1',
    service: 'execute-api',
  },
  {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  }
);
axios.interceptors.request.use(interceptor);

const HELLO = gql`
  {
    hello
  }
`;

export const handler = async (event: any): Promise<any> => {
  const logText = `
  AWS_ACCESS_KEY_ID = ${process.env.AWS_ACCESS_KEY_ID};
  AWS_SECRET_ACCESS_KEY = ${process.env.AWS_SECRET_ACCESS_KEY};
  AWS_SESSION_TOKEN = ${process.env.AWS_SESSION_TOKEN}`;

  console.log(logText);

  const awsGraphqlFetch = (uri, options) => {
    options = options || {};
    const urlObject = url.parse(uri);

    const signable = { host: urlObject.host, path: urlObject.path, headers: {} };

    const list = ['method', 'body', 'headers', 'region', 'service'];

    list.forEach((key) => {
      signable[key] = options[key];
    });

    const credentials = {
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    };
    aws4.sign(signable, credentials);
    options.headers = signable.headers;
    return fetch(uri, options);
  };
  const client = new ApolloClient({
    link: createHttpLink({
      uri: 'https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/internal/graphql',
      fetch: buildAxiosFetch(axios),
    }) as any,
    cache: new InMemoryCache(),
  });

  // const client = new ApolloClient({
  //   link: new HttpLink({
  //     uri: 'https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/internal/graphql',
  //     fetch: awsGraphqlFetch,
  //   }),
  //   cache: new InMemoryCache(),
  // });

  try {
    const response = await client.query({ query: HELLO });

    // const response = await axios.post('https://mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com/dev/internal/graphql', {
    //   query: `{
    //     hello
    //   }
    //   `,
    // });
    console.log('response', response);

    // client.query
  } catch (err) {
    console.log({ err });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: 'done',
    }),
  };
};
