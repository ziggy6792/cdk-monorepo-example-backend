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
import { Duration } from '@aws-cdk/core';
import * as util from '../util';
import { MultiAuthApiGatewayLambda } from '../constructs/multi-auth-apigateway-lambda';
import CognitoIdentityPool from '../constructs/cognito-identity-pool';

export interface DeploymentStackProps extends cdk.StackProps {
  readonly stage: string;
}

export class DeploymentStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: DeploymentStackProps) {
    super(scope, id, props);

    const { stage } = props;

    const REGION = 'ap-southeast-1';

    const callbackUrls = ['http://localhost:3000/profile/'];
    const logoutUrls = ['http://localhost:3000/profile/'];
    const domainPrefix = `alpaca-${stage}`;
    const facebookClientId = '401988904382290';
    const facebookClientSecret = '56dc78be341d68d0f0e3229a6ee37723';

    const scopes = [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL, cognito.OAuthScope.PHONE, cognito.OAuthScope.COGNITO_ADMIN];

    const lambdaGqResolverEnv = {
      REGION,
      ENV: stage,
    };

    const apiConstruct = new MultiAuthApiGatewayLambda(this, util.getConstructId('api', stage), {
      lambdaFunctionProps: {
        functionName: util.getConstructName('gq-resolver', stage),
        description: util.getConstructDescription('gq-resolver', stage),
        memorySize: 256,
        timeout: Duration.seconds(30),
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(path.join(require.resolve('@danielblignaut/lambda-gq-resolver'), '..')),
        environment: lambdaGqResolverEnv,
      },
      apiGatewayProps: {
        restApiName: util.getConstructName('api', stage),
        description: util.getConstructDescription('api', stage),
        proxy: false,
        deployOptions: { stageName: 'staging' },
        defaultCorsPreflightOptions: {
          allowOrigins: ['*'],
          allowHeaders: ['*'],
          allowMethods: ['*'],
        },
      },
      cognitoUserPoolProps: {
        userPoolName: util.getConstructName('userpool', stage),
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
            mutable: true,
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

    // Add facebook integration
    const identityProviderFacebook = new cognito.UserPoolIdentityProviderFacebook(this, util.getConstructId('facebook', stage), {
      userPool: apiConstruct.userPool,
      clientId: facebookClientId,
      clientSecret: facebookClientSecret,
      scopes: ['email', 'public_profile'],
      attributeMapping: {
        email: cognito.ProviderAttribute.FACEBOOK_EMAIL,
        givenName: cognito.ProviderAttribute.FACEBOOK_FIRST_NAME,
        familyName: cognito.ProviderAttribute.FACEBOOK_LAST_NAME,
      },
    });

    // Add App client
    const client = apiConstruct.userPool.addClient(util.getConstructId('client', stage), {
      userPoolClientName: util.getConstructName('client', stage),
      oAuth: {
        flows: { authorizationCodeGrant: true, implicitCodeGrant: true },
        scopes,
        callbackUrls,
        logoutUrls,
      },
      supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.COGNITO, cognito.UserPoolClientIdentityProvider.FACEBOOK],
      // supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.COGNITO],
    });

    client.node.addDependency(identityProviderFacebook);

    apiConstruct.userPool.addDomain('CognitoDomain', {
      cognitoDomain: {
        domainPrefix,
      },
    });
    // Add identiy pool

    const identityPoolConstruct = new CognitoIdentityPool(this, util.getConstructId('identitypool', stage), {
      identityPoolProps: {
        allowUnauthenticatedIdentities: true, // Allow unathenticated users
        cognitoIdentityProviders: [
          {
            clientId: client.userPoolClientId,
            providerName: apiConstruct.userPool.userPoolProviderName,
          },
        ],
      },
    });

    // defaults.printWarning(construct.apiGateway.restApiId);
    const { authUserResource, authRoleResource, authNoneResource } = apiConstruct;

    const resorces = [authUserResource, authRoleResource, authNoneResource];

    const gqUrls: { [key: string]: string } = {};

    resorces.forEach((resorce) => {
      const graphqlResource = resorce.addResource('graphql');
      gqUrls[resorce.path] = apiConstruct.apiGateway.urlForPath(graphqlResource.path);
      graphqlResource.addMethod('GET');
      graphqlResource.addMethod('POST');
    });

    const lambdaUserConfirmed = new lambda.Function(this, util.getConstructId('userconfirmed', stage), {
      functionName: util.getConstructName('user-confirmed', stage),
      description: util.getConstructDescription('user-confirmed', stage),
      memorySize: 256,
      timeout: Duration.seconds(30),
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(require.resolve('@danielblignaut/lambda-user-confirmed'), '..')),
      environment: {
        SSM_BACKEND_CONFIG: util.getSsmParamId('beconfig', stage),
      },
    });

    // defaults.printWarning(util.getSsmParamId('beconfig', stage));

    // lambdaUserConfirmed.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonAPIGatewayInvokeFullAccess'));
    lambdaUserConfirmed.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMFullAccess'));
    lambdaUserConfirmed.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonCognitoPowerUser'));

    const rolesWithApiAccesss = {
      UserConfirmed: lambdaUserConfirmed.role,
      IdentityPoolAuthenticated: identityPoolConstruct.authentictedRole,
      IdentityPoolUnauthenticated: identityPoolConstruct.unauthenticatedRole,
    };

    apiConstruct.addAuthorizers(rolesWithApiAccesss);

    apiConstruct.userPool.addTrigger(cognito.UserPoolOperation.POST_CONFIRMATION, lambdaUserConfirmed);

    apiConstruct.lambdaFunction.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));

    const authRoleApiUrl = new ssm.StringParameter(this, util.getConstructId('graphqlendpoint-authrole', stage), {
      parameterName: util.getSsmParamId('beconfig/aws_graphqlEndpoint_authRole', stage),
      stringValue: gqUrls[authRoleResource.path],
    });

    // defaults.printWarning(util.getSsmParamId('beconfig/aws_graphqlEndpoint_authRole', stage));

    // const clientConfig = {
    //   aws_project_region: 'ap-southeast-1',
    //   aws_cognito_identity_pool_id: identityPoolConstruct.identityPool.ref,
    //   aws_cognito_region: 'ap-southeast-1',
    //   aws_user_pools_id: apiConstruct.userPool.userPoolId,
    //   aws_user_pools_web_client_id: client.userPoolClientId,
    //   aws_graphqlEndpoint_authUser: gqUrls[authUserResource.path],
    //   aws_graphqlEndpoint_authRole: gqUrls[authRoleResource.path],
    //   aws_graphqlEndpoint_authNone: gqUrls[authNoneResource.path],
    //   oauth: {
    //     domain: `${domainPrefix}.auth.ap-southeast-1.amazoncognito.com`,
    //     scope: scopes.map((scope) => scope.scopeName),
    //     // redirectSignIn: '/profile/',
    //     // redirectSignOut: '/profile/',
    //     responseType: 'code',
    //   },
    // };

    const frontendConfig = `
REACT_APP_AWS_COGNITO_IDENDITY_POOL_ID = ${identityPoolConstruct.identityPool.ref}
REACT_APP_AWS_USER_POOLS_ID = ${apiConstruct.userPool.userPoolId}
REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID = ${client.userPoolClientId}

REACT_APP_AWS_GRAPHQLENDPOINT_AUTHUSER = ${gqUrls[authUserResource.path]}
REACT_APP_AWS_GRAPHQLENDPOINT_AUTHROLE = ${gqUrls[authRoleResource.path]}
REACT_APP_AWS_GRAPHQLENDPOINT_AUTHNONE = ${gqUrls[authNoneResource.path]}

REACT_APP_AWS_OATH_DOMAIN = ${domainPrefix}.auth.ap-southeast-1.amazoncognito.com
`;

    const localLambdaServerConfig = {
      REGION,
      ENV: 'staging',
      COGNITO_USER_POOL_ID: apiConstruct.userPool.userPoolId,
    };

    // lambdaUserConfirmed.a

    // const localLambdaServerConfigOutput = new cdk.CfnOutput(this, 'local-lambda-config', {
    //   description: 'local-lambda-config',
    //   value: JSON.stringify(localLambdaServerConfig),
    // });

    // const clientConfigOutput = new cdk.CfnOutput(this, 'frontend-config', {
    //   description: 'frontend-config',
    //   value: frontendConfig,
    // });
  }
}
