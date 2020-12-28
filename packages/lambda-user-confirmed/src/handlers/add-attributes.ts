/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable-line */
import aws from 'aws-sdk';
import _ from 'lodash';
import * as lambda from 'aws-lambda';
import { CognitoPostConfimEvent } from '../types';

// APIGatewayProxyCallback, APIGatewayProxyEvent, Context

const addAttributes = async (
  event: CognitoPostConfimEvent,
  context: lambda.Context,
  callback: lambda.APIGatewayProxyCallback
): Promise<CognitoPostConfimEvent> => {
  let modifiedUserAttributes = event.request.userAttributes;
  const customSignUpAttributesString = modifiedUserAttributes['custom:signUpAttributes'];
  const customSignUpAttributes = customSignUpAttributesString ? JSON.parse(customSignUpAttributesString) : undefined;

  if (!customSignUpAttributes || _.isEmpty(customSignUpAttributes)) {
    console.log('no sign up attributes');
    return event;
  }

  modifiedUserAttributes = { ...modifiedUserAttributes, ...customSignUpAttributes };
  delete modifiedUserAttributes['custom:signUpAttributes'];
  event.request.userAttributes = modifiedUserAttributes;

  console.log('add-attributes');

  const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

  const mappedAttributes = Object.entries(customSignUpAttributes).map(([key, value]) => ({ Name: key, Value: value }));

  console.log('mappedAttributes');
  console.log(mappedAttributes);

  const updateAttributesParams = {
    UserAttributes: mappedAttributes,
    UserPoolId: event.userPoolId,
    Username: event.userName,
    // ClientMetadata: {
    //   '<StringType>': 'STRING_VALUE',
    //   /* '<StringType>': ... */
    // }
  };

  try {
    await cognitoidentityserviceprovider.adminUpdateUserAttributes(updateAttributesParams as any).promise();
  } catch (e) {
    console.log({ e });
    callback(e);
  }

  // ToDo
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#adminDeleteUserAttributes-property

  return event;
};

export default addAttributes;
