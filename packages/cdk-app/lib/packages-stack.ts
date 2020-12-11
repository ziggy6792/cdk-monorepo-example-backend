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
import { MultiAuthApiGatewayLambda } from '../constructs/multi-auth-apigateway-lambda';
import addCorsOptions from './add-cors-options';

export class PackagesStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const REGION = 'ap-southeast-1';

    const generateConstructId = (constructId: string): string => {
      return `${id}-${constructId}`;
    };

    const apiConstruct = new MultiAuthApiGatewayLambda(this, generateConstructId('api'), {
      lambdaFunctionProps: {
        code: lambda.Code.fromAsset('lambda/api-caller'),
        functionName: generateConstructId('api-caller'),
        description: generateConstructId('api-caller'),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_12_X,
      },
      apiGatewayProps: {
        restApiName: generateConstructId('api'),
        description: generateConstructId('api'),
        proxy: false,
        deployOptions: { stageName: 'dev' },
        defaultCorsPreflightOptions: {
          allowOrigins: ['*'],
          allowHeaders: ['*'],
          allowMethods: ['*'],
        },
      },
      cognitoUserPoolProps: {
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
          signUpAttributes: new cognito.StringAttribute({ minLen: 1, maxLen: 2048, mutable: true }),
        },
        passwordPolicy: {
          tempPasswordValidity: cdk.Duration.days(2),
          minLength: 6,
          requireDigits: false,
          requireLowercase: false,
          requireUppercase: false,
          requireSymbols: false,
        },
        accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      },
    });

    const client = apiConstruct.userPool.addClient(generateConstructId('client'), {
      userPoolClientName: generateConstructId('client'),
      oAuth: {
        flows: { authorizationCodeGrant: true, implicitCodeGrant: true },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL, cognito.OAuthScope.PHONE, cognito.OAuthScope.COGNITO_ADMIN],
        callbackUrls: ['http://localhost:3000/'],
        logoutUrls: ['http://localhost:3000/'],
      },
      // supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.AMAZON, cognito.UserPoolClientIdentityProvider.COGNITO],
    });
    const domainPrefix = apiConstruct.apiGateway.restApiId;

    apiConstruct.userPool.addDomain('CognitoDomain', {
      cognitoDomain: {
        domainPrefix,
      },
    });

    // defaults.printWarning(construct.apiGateway.restApiId);

    const externalProxy = apiConstruct.externalResource.addProxy();
    externalProxy.addMethod('GET');
    externalProxy.addMethod('POST');

    const internalProxy = apiConstruct.internalResource.addProxy();
    internalProxy.addMethod('GET');
    internalProxy.addMethod('POST');

    const unprotectedProxy = apiConstruct.unprotectedResource.addProxy();
    unprotectedProxy.addMethod('GET');
    unprotectedProxy.addMethod('POST');

    // apiCallerHandler!.role!.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonAPIGatewayInvokeFullAccess'));

    apiConstruct.addAuthorizers();

    const lambdaGqResolverEnv = {
      REGION,
      ENV: 'dev',
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

    const removeTralingSlash = (url: string) => url.replace(/\/$/, '');

    const clientConfig = {
      API_URL: `${removeTralingSlash(apiConstruct.apiGateway.url)}${removeTralingSlash(apiConstruct.externalResource.path)}/graphql`,
      USER_POOL_ID: apiConstruct.userPool.userPoolId,
      WEB_APP_CLIENT_ID: client.userPoolClientId,
    };

    const clientConfigOutput = new cdk.CfnOutput(this, 'client-config', {
      description: 'client-config',
      value: JSON.stringify(clientConfig),
    });

    const localLambdaServerConfig = {
      REGION,
      ENV: 'dev',
      COGNITO_USER_POOL_ID: apiConstruct.userPool.userPoolId,
    };

    const localGqlServerEnv = new cdk.CfnOutput(this, 'local-gql-server-env', {
      description: 'lambda-server-config',
      value: JSON.stringify(localLambdaServerConfig),
    });
  }
}
