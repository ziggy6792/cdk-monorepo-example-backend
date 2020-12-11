/* eslint-disable max-len */
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
import { AccountRecovery, CfnUserPoolGroup, StringAttribute, UserPoolOperation } from '@aws-cdk/aws-cognito';
import { AuthorizationType, CfnAuthorizer, LambdaIntegration, LambdaRestApi, RestApi } from '@aws-cdk/aws-apigateway';
import addCorsOptions from './add-cors-options';

export class PackagesStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const generateConstructId = (constructId: string): string => {
      return `${id}-${constructId}`;
    };

    const pool = new cognito.UserPool(this, generateConstructId('user-pool'), {
      userPoolName: generateConstructId('user-pool'),
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: false,
        },
      },
      customAttributes: {
        signUpAttributes: new StringAttribute({ minLen: 1, maxLen: 2048, mutable: true }),
      },
      passwordPolicy: {
        tempPasswordValidity: Duration.days(2),
        minLength: 6,
        requireDigits: false,
        requireLowercase: false,
        requireUppercase: false,
        requireSymbols: false,
      },
      accountRecovery: AccountRecovery.EMAIL_ONLY,
    });

    const adminGroup = new CfnUserPoolGroup(this, 'AdminsGroup', {
      groupName: 'user',
      userPoolId: pool.userPoolId,
    });

    const userGroup = new CfnUserPoolGroup(this, 'UsersGroup', {
      groupName: 'administrator',
      userPoolId: pool.userPoolId,
    });

    const client = pool.addClient('web-app-client');

    const lambdaGqResolverEnv = {
      REGION: 'ap-southeast-1',
      ENV: 'dev',
      COGNITO_USER_POOL_ID: pool.userPoolId,
    };

    const lambdaGqResolver = new lambda.Function(this, generateConstructId('lambda-gq-resolver'), {
      functionName: generateConstructId('lambda-gq-resolver'),
      description: generateConstructId('lambda-gq-resolver'),
      memorySize: 256,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(require.resolve('@danielblignaut/lambda-gq-resolver'), '..')),
      environment: lambdaGqResolverEnv,
    });

    lambdaGqResolver.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));

    // const api = new apiGateway.LambdaRestApi(this, generateConstructId('graphql-api'), {
    //   handler: lambdaGqResolver,
    // });

    // const api = new RestApi(this, generateConstructId('graphql-api'), {
    //   restApiName: 'Rest-Name',
    //   description: generateConstructId('graphql-api'),
    //   defaultCorsPreflightOptions: {
    //     allowMethods: ['DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'],
    //     allowHeaders: [
    //       'Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers',
    //     ],
    //     allowOrigins: ['*'],
    //   },
    // });

    // construct: apigw
    const api = new LambdaRestApi(this, generateConstructId('graphql-api'), {
      handler: lambdaGqResolver, // attaching lambda function
      apiKeySourceType: apiGateway.ApiKeySourceType.HEADER,
      restApiName: generateConstructId('graphql-api'),
      deployOptions: { stageName: 'prod' },
      defaultMethodOptions: {
        apiKeyRequired: false,
      },
      proxy: false,
    });

    const region = 'ap-southeast-1';
    const account = '694710432912';

    const cognitoArn = `arn:aws:cognito-idp:${region}:${account}:userpool/${pool.userPoolId}`;

    const authorizer = new CfnAuthorizer(this, 'APIGatewayAuthorizer', {
      name: 'customer-authorizer',
      identitySource: 'method.request.header.Authorization',
      providerArns: [cognitoArn],
      restApiId: api.restApiId,
      type: AuthorizationType.COGNITO,
    });

    const resource = api.root.addResource('graphql'); // creating a resource
    addCorsOptions(resource);

    const method = resource.addMethod('POST', undefined, {
      // apiKeyRequired: true, // enable this if you need API key
      authorizationType: apiGateway.AuthorizationType.COGNITO,
      authorizer: { authorizerId: authorizer.ref },
    });

    const clientConfig = new cdk.CfnOutput(this, 'client-config', {
      description: 'client-config',
      value: JSON.stringify({
        API_URL: `${api.url}/graphql`,
        USER_POOL_ID: pool.userPoolId,
        WEB_APP_CLIENT_ID: client.userPoolClientId,
      }),
    });

    const localGqlServerEnv = new cdk.CfnOutput(this, 'local-gql-server-env', {
      description: 'client-config',
      value: JSON.stringify(lambdaGqResolverEnv),
    });
  }
}
