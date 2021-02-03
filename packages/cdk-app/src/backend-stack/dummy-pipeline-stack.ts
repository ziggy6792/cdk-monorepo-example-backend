/* eslint-disable import/prefer-default-export */
import * as cdk from '@aws-cdk/core';

import { DEPLOYMENT_CONFIG } from 'src/config';
import { commonConfig } from '@simonverhoeven/common';

import DeploymentStack from './deployment-stack';

class DummyPipelineStack extends cdk.Stack {
    public readonly stagingUrlOutput: cdk.CfnOutput;

    public readonly prodUrlOutput: cdk.CfnOutput;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stages = ['staging', 'prod'];

        stages.forEach((stageName) => {
            const stagingConfig = DEPLOYMENT_CONFIG[stageName];
            const stagingDeployment = new DeploymentStack(this, `${commonConfig.PROJECT_NAME}-${stageName}-deployment`, { stageName, ...stagingConfig });
        });
    }
}

export default DummyPipelineStack;
