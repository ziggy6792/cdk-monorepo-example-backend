// Dummy stack
import { DEPLOYMENT_CONFIG, PROJECT_NAME } from 'src/config';
import * as cdk from '@aws-cdk/core';
import { DeploymentStack } from 'src/backend-stack/deployment-stack';

const createDummyStack = (scope: cdk.Construct) => {
    const stageName = 'dummy';

    const deploymentConfig = DEPLOYMENT_CONFIG[stageName];

    const stack = new DeploymentStack(scope, `${PROJECT_NAME}-dummy-deployment`, {
        stageName,
        ...deploymentConfig,
    });
};

export default createDummyStack;
