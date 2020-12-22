/* eslint-disable import/prefer-default-export */
import 'source-map-support/register';

import * as lambda from 'aws-lambda';
import loadConfig, { config } from './config';
// import { initApolloClient } from './util/apollo-client';
import { CognitoPostConfimEvent } from './types';
import addAttributes from './handlers/add-attributes';
import addToGroup from './handlers/add-to-group';
import addUserToModel from './handlers/add-to-model';

export const handler = async (
  event: CognitoPostConfimEvent,
  context: lambda.Context,
  callback: lambda.APIGatewayProxyCallback
): Promise<CognitoPostConfimEvent> => {
  console.log('Recieved', JSON.stringify(event));

  // event.req

  await loadConfig(process.env.SSM_BACKEND_CONFIG);

  const envLogText = `
  AWS_REGION = ${process.env.AWS_REGION}
  AWS_ACCESS_KEY_ID = ${process.env.AWS_ACCESS_KEY_ID}
  AWS_SECRET_ACCESS_KEY = ${process.env.AWS_SECRET_ACCESS_KEY}
  AWS_SESSION_TOKEN = ${process.env.AWS_SESSION_TOKEN}
  `;

  console.log('env', envLogText);

  event = await addAttributes(event, context, callback);

  event = await addToGroup(event, context, callback);

  event = await addUserToModel(event, context, callback);

  return event;
};
