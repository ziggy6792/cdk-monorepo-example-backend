/* eslint-disable import/prefer-default-export */
import 'source-map-support/register';

import gql from 'graphql-tag';

import loadConfig, { CONFIG } from './config';
import { apolloClient, initApolloClient } from './util/apollo-client';

const HELLO = gql`
  {
    hello
  }
`;

const REGISTER = gql`
  mutation register($input: RegisterInput!) {
    register(input: $input) {
      id
    }
  }
`;

export const handler = async (event: any, context, callback): Promise<any> => {
  console.log('Recieved', JSON.stringify(event));

  await loadConfig(process.env.SSM_BACKEND_CONFIG);

  const envLogText = `
  AWS_REGION = ${process.env.AWS_REGION}
  AWS_ACCESS_KEY_ID = ${process.env.AWS_ACCESS_KEY_ID}
  AWS_SECRET_ACCESS_KEY = ${process.env.AWS_SECRET_ACCESS_KEY}
  AWS_SESSION_TOKEN = ${process.env.AWS_SESSION_TOKEN}
  `;

  console.log('env', envLogText);

  initApolloClient({
    region: process.env.AWS_REGION,
    uri: CONFIG.GRAPHQL_API_URL,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  });

  // console.log('env', process.env);

  const configLogText = `
  GRAPHQL_API_URL = ${CONFIG.GRAPHQL_API_URL}
  `;

  console.log('config', configLogText);

  try {
    // const response = await client.query({ query: HELLO });
    const response = await apolloClient.mutate({
      mutation: REGISTER,
      variables: {
        input: {
          firstName: 'Simon',
          lastName: 'Verhoeven',
          email: 'ziggy067@gmail.com',
        },
      },
    });

    console.log('response', response.data);
  } catch (err) {
    console.log('ERROR');

    console.log({ err });
  }

  // callback(null, event);

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: 'done',
    }),
  };
};
