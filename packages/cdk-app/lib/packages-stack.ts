/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as cognito from '@aws-cdk/aws-cognito';
import * as api from '@aws-cdk/aws-apigateway';
import * as ssm from '@aws-cdk/aws-ssm';
import * as defaults from '@aws-solutions-constructs/core';

import path from 'path';
import { MultiAuthApiGatewayLambda } from '../constructs/multi-auth-apigateway-lambda';

export class PackagesStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const REGION = 'ap-southeast-1';
    const scopes = [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL, cognito.OAuthScope.PHONE, cognito.OAuthScope.COGNITO_ADMIN];

    const generateConstructId = (constructId: string, sep = '-'): string => {
      return `${id}${sep}${constructId}`;
    };

    const generateSsmParamId = (paramId: string, sep = '/'): string => {
      return `${sep}${id}${paramId}`;
    };

    const lambdaGqResolverEnv = {
      REGION,
      ENV: 'dev',
    };

    const apiConstruct = new MultiAuthApiGatewayLambda(this, generateConstructId('api'), {
      lambdaFunctionProps: {
        functionName: generateConstructId('lambda-gq-resolver'),
        description: generateConstructId('lambda-gq-resolver'),
        memorySize: 256,
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(path.join(require.resolve('@danielblignaut/lambda-gq-resolver'), '..')),
        environment: lambdaGqResolverEnv,
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
      scopes,
    });

    const client = apiConstruct.userPool.addClient(generateConstructId('client'), {
      userPoolClientName: generateConstructId('client'),
      oAuth: {
        flows: { authorizationCodeGrant: true, implicitCodeGrant: true },
        scopes,
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
    const { externalResource, internalResource, unprotectedResource } = apiConstruct;

    const resorces = [externalResource, internalResource, unprotectedResource];

    const gqUrls: { [key: string]: string } = {};

    resorces.forEach((resorce) => {
      const graphqlResource = resorce.addResource('graphql');
      gqUrls[resorce.path] = apiConstruct.apiGateway.urlForPath(graphqlResource.path);
      graphqlResource.addMethod('GET');
      graphqlResource.addMethod('POST');
    });
    apiConstruct.addAuthorizers();

    const lambdaUserConfirmed = new lambda.Function(this, generateConstructId('lambda-user-confirmed'), {
      functionName: generateConstructId('lambda-user-confirmed'),
      description: generateConstructId('lambda-user-confirmed'),
      memorySize: 256,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(require.resolve('@danielblignaut/lambda-user-confirmed'), '..')),
      environment: {
        SSM_BACKEND_CONFIG: generateSsmParamId('/beconfig'),
      },
    });

    lambdaUserConfirmed.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonAPIGatewayInvokeFullAccess'));

    apiConstruct.userPool.addTrigger(cognito.UserPoolOperation.POST_CONFIRMATION, lambdaUserConfirmed);

    apiConstruct.lambdaFunction.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));

    const internalApiUrl = new ssm.StringParameter(this, generateConstructId('internal-api-url'), {
      parameterName: generateSsmParamId('/beconfig/GRAPHQL_API_URL'),
      stringValue: gqUrls[internalResource.path],
    });

    // const externalApiUrl = new ssm.StringParameter(this, generateConstructId('external-api-url'), {
    //   parameterName: generateConstructId('/beconfig/url', '/'),
    //   stringValue: gqUrls[externalResource.path],
    // });

    const clientConfig = {
      API_URL: gqUrls[externalResource.path],
      USER_POOL_ID: apiConstruct.userPool.userPoolId,
      WEB_APP_CLIENT_ID: client.userPoolClientId,
    };

    const localLambdaServerConfig = {
      REGION,
      ENV: 'dev',
      COGNITO_USER_POOL_ID: apiConstruct.userPool.userPoolId,
    };

    // lambdaUserConfirmed.a

    const localLambdaServerConfigOutput = new cdk.CfnOutput(this, 'local-lambda-config', {
      description: 'local-lambda-config',
      value: JSON.stringify(localLambdaServerConfig),
    });

    const clientConfigOutput = new cdk.CfnOutput(this, 'client-config', {
      description: 'client-config',
      value: JSON.stringify(clientConfig),
    });
  }
}
