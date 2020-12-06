/* eslint-disable import/prefer-default-export */
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import path from 'path';
import * as apiGateway from '@aws-cdk/aws-apigateway';
import * as cognito from '@aws-cdk/aws-cognito';
import { Duration } from '@aws-cdk/core';

export class PackagesStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const generateConstructId = (constructId: string): string => {
      return `${id}-${constructId}`;
    };

    const lambdaA = new lambda.Function(this, generateConstructId('lambda-a'), {
      functionName: generateConstructId('lambda-a'),
      description: generateConstructId('lambda-a'),
      memorySize: 256,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(require.resolve('@danielblignaut/lambda-a'), '..')),
    });

    const lambdaB = new lambda.Function(this, generateConstructId('lambda-b'), {
      functionName: generateConstructId('lambda-b'),
      description: generateConstructId('lambda-b'),
      memorySize: 256,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(require.resolve('@danielblignaut/lambda-b'), '..')),
    });

    const lambdaGqResolver = new lambda.Function(this, generateConstructId('lambda-gq-resolver'), {
      functionName: generateConstructId('lambda-gq-resolver'),
      description: generateConstructId('lambda-gq-resolver'),
      memorySize: 256,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(require.resolve('@danielblignaut/lambda-gq-resolver'), '..')),
    });

    lambdaGqResolver.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));

    const api = new apiGateway.LambdaRestApi(this, generateConstructId('graphql-api'), {
      handler: lambdaGqResolver,
    });

    const pool = new cognito.UserPool(this, generateConstructId('user-pool'), {
      // ...
      selfSignUpEnabled: true,
      userVerification: {
        emailSubject: 'Verify your email for our awesome app!',
        emailBody: 'Hello {username}, Thanks for signing up to our awesome app! Your verification code is {####}',
        emailStyle: cognito.VerificationEmailStyle.CODE,
        smsMessage: 'Hello {username}, Thanks for signing up to our awesome app! Your verification code is {####}',
      },
      passwordPolicy: {
        tempPasswordValidity: Duration.days(2),
        minLength: 6,
        requireDigits: false,
        requireLowercase: false,
        requireUppercase: false,
        requireSymbols: false,
      },
    });

    const client = pool.addClient('web-app-client');

    const urlOutput = new cdk.CfnOutput(this, 'webservice-url', { description: 'webservice-url', value: api.url });
    const clientId = new cdk.CfnOutput(this, 'web-app-client-id', { description: 'web-app-client-id', value: client.userPoolClientId });
  }
}
