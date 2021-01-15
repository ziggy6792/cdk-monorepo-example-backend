// eslint-disable-next-line import/no-extraneous-dependencies
import aws from 'aws-sdk';
import * as lambda from 'aws-lambda';
import { CognitoPostConfimEvent } from 'src/types';

const addToGroup = async (
  event: CognitoPostConfimEvent,
  context: lambda.Context,
  callback: lambda.APIGatewayProxyCallback
): Promise<CognitoPostConfimEvent> => {
  console.log('add-to-group');

  await addUserToGroup(event, callback, 'user');
  // callback(null, event);
  return event;
};

const addUserToGroup = async (event: CognitoPostConfimEvent, callback: lambda.APIGatewayProxyCallback, groupName: string) => {
  const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
  const groupParams = {
    GroupName: groupName,
    UserPoolId: event.userPoolId,
  };

  const addUserParams = {
    GroupName: groupName,
    UserPoolId: event.userPoolId,
    Username: event.userName,
  };

  try {
    await cognitoidentityserviceprovider.getGroup(groupParams).promise();
  } catch (e) {
    await cognitoidentityserviceprovider.createGroup(groupParams).promise();
  }

  try {
    await cognitoidentityserviceprovider.adminAddUserToGroup(addUserParams).promise();
  } catch (e) {
    callback(e);
  }
};

export default addToGroup;
