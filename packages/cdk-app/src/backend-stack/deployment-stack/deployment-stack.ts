/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as cognito from '@aws-cdk/aws-cognito';
import * as ssm from '@aws-cdk/aws-ssm';

import path from 'path';
import * as utils from 'src/utils';
import { MultiAuthApiGatewayLambda } from 'src/constructs/multi-auth-apigateway-lambda';
import CognitoIdentityPool from 'src/constructs/cognito-identity-pool';
import jsonBeautify from 'json-beautify';
import DbTables from './constructs/db-tables';

export interface DeploymentStackProps extends cdk.StackProps {
    readonly stageName: string;
    readonly facebookClientId: string;
    readonly facebookClientSecret: string;
    readonly domainPrefix: string;
}

class DeploymentStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: DeploymentStackProps) {
        super(scope, id, props);

        const { stageName, facebookClientId, facebookClientSecret, domainPrefix } = props;

        const REGION = 'ap-southeast-1';

        const callbackUrls = ['http://localhost:3000/profile/'];
        const logoutUrls = ['http://localhost:3000/profile/'];

        const scopes = [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL, cognito.OAuthScope.PHONE, cognito.OAuthScope.COGNITO_ADMIN];

        const lambdaGqResolverEnv = {
            REGION,
            ENV: stageName,
        };

        const apiConstruct = new MultiAuthApiGatewayLambda(this, utils.getConstructId('api', stageName), {
            lambdaFunctionProps: {
                functionName: utils.getConstructName('gq-resolver', stageName),
                description: utils.getConstructDescription('gq-resolver', stageName),
                memorySize: 256,
                timeout: cdk.Duration.seconds(30),
                runtime: lambda.Runtime.NODEJS_12_X,
                handler: 'index.handler',
                code: lambda.Code.fromAsset(path.join(require.resolve('@simonverhoeven/lambda-gq-resolver'), '..')),
                environment: lambdaGqResolverEnv,
            },
            apiGatewayProps: {
                restApiName: utils.getConstructName('api', stageName),
                description: utils.getConstructDescription('api', stageName),
                proxy: false,
                deployOptions: { stageName },
                defaultCorsPreflightOptions: {
                    allowOrigins: ['*'],
                    allowHeaders: ['*'],
                    allowMethods: ['*'],
                },
            },
            cognitoUserPoolProps: {
                userPoolName: utils.getConstructName('userpool', stageName),
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
        const identityProviderFacebook = new cognito.UserPoolIdentityProviderFacebook(this, utils.getConstructId('facebook', stageName), {
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
        const client = apiConstruct.userPool.addClient(utils.getConstructId('client', stageName), {
            userPoolClientName: utils.getConstructName('client', stageName),
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

        const identityPoolConstruct = new CognitoIdentityPool(this, utils.getConstructId('identitypool', stageName), {
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

        const lambdaConfigParam = {
            name: utils.getSsmParamId('lambda-config', stageName),
            value: { aws_graphqlEndpoint_authRole: gqUrls[authRoleResource.path] },
        };

        const lambdaUserConfirmed = new lambda.Function(this, utils.getConstructId('userconfirmed', stageName), {
            functionName: utils.getConstructName('user-confirmed', stageName),
            description: utils.getConstructDescription('user-confirmed', stageName),
            memorySize: 256,
            timeout: cdk.Duration.seconds(30),
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path.join(require.resolve('@simonverhoeven/lambda-user-confirmed'), '..')),
            environment: {
                SSM_LAMBDA_CONFIG: lambdaConfigParam.name,
            },
        });

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

        const dbTablesContruct = new DbTables(this, utils.getConstructId('db-tables', stageName), { stageName });

        const lambdaConfigSSM = new ssm.StringParameter(this, lambdaConfigParam.name, {
            parameterName: lambdaConfigParam.name,
            stringValue: jsonBeautify(lambdaConfigParam.value, null, 2, 100),
        });

        const frontendConfig = {
            ENV: stageName,
            AWS_REGION: 'ap-southeast-1',
            AWS_COGNITO_IDENDITY_POOL_ID: identityPoolConstruct.identityPool.ref,
            AWS_USER_POOLS_ID: apiConstruct.userPool.userPoolId,
            AWS_USER_POOLS_WEB_CLIENT_ID: client.userPoolClientId,
            AWS_GRAPHQLENDPOINT_AUTHUSER: gqUrls[authUserResource.path],
            AWS_GRAPHQLENDPOINT_AUTHROLE: gqUrls[authRoleResource.path],
            AWS_GRAPHQLENDPOINT_AUTHNONE: gqUrls[authNoneResource.path],
            AWS_OATH_DOMAIN: `${domainPrefix}.auth.ap-southeast-1.amazoncognito.com`,
        };

        const localLambdaServerConfig = {
            REGION,
            ENV: 'dev',
            COGNITO_USER_POOL_ID: apiConstruct.userPool.userPoolId,
        };

        // lambdaUserConfirmed.a

        const localLambdaServerConfigOutput = new cdk.CfnOutput(this, 'locallambda-config', {
            description: 'local-lambda-config',
            value: jsonBeautify(localLambdaServerConfig, null, 2, 100),
        });

        const clientConfigOutput = new cdk.CfnOutput(this, 'frontend-config', {
            description: 'frontend-config',
            value: jsonBeautify(frontendConfig, null, 2, 100),
        });

        const clientConfSSM = new ssm.StringParameter(this, utils.getConstructId('frontend-config', stageName), {
            parameterName: utils.getSsmParamId('frontend-config', stageName),
            stringValue: jsonBeautify(frontendConfig, null, 2, 100),
        });
    }
}

export default DeploymentStack;
