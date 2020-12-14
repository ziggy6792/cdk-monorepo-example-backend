import aws from 'aws-sdk';
import * as lambda from 'aws-lambda';
import { CognitoPostConfimEvent } from '../types';
import * as api from '../services/gql-api';
import { initApolloClient } from '../util/apollo-client';
import { CONFIG } from '../config';

const addUserToModel = async (event: CognitoPostConfimEvent): Promise<CognitoPostConfimEvent> => {
  initApolloClient({
    region: process.env.AWS_REGION,
    uri: CONFIG.GRAPHQL_API_URL,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  });

  const { userName } = event;
  // eslint-disable-next-line camelcase
  const { email, given_name, family_name } = event.request.userAttributes;

  const user = { id: userName, firstName: given_name, lastName: family_name, email };

  console.log('User', user);

  await api.registerUser(user);

  return event;
};

export default addUserToModel;
