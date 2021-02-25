// Dummy stack

import { DEPLOYMENT_CONFIG } from 'src/config';
import * as cdk from '@aws-cdk/core';
import DeploymentStack from 'src/stacks/deployment-stack';
import { commonConfig } from '@alpaca-backend/common';

const createDummyStack = (scope: cdk.Construct) => {
    const stageName = 'dummy';

    const deploymentConfig = DEPLOYMENT_CONFIG[stageName];

    const stack = new DeploymentStack(scope, `${commonConfig.PROJECT_NAME}-dummy-deployment`, {
        stageName,
        ...deploymentConfig,
    });
};

export default createDummyStack;
