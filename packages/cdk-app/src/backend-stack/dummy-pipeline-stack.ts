/* eslint-disable import/prefer-default-export */
import * as cdk from '@aws-cdk/core';

import { DEPLOYMENT_CONFIG, PROJECT_NAME } from 'src/config';
import { DeploymentStack } from './deployment-stack';

class DummyPipelineStack extends cdk.Stack {
    public readonly stagingUrlOutput: cdk.CfnOutput;

    public readonly prodUrlOutput: cdk.CfnOutput;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const stages = ['deployment', 'prod'];

        stages.forEach((stageName) => {
            const stagingConfig = DEPLOYMENT_CONFIG[stageName];
            const stagingDeployment = new DeploymentStack(this, `${PROJECT_NAME}-${stageName}-deployment`, { stageName, ...stagingConfig });
        });
    }
}

export default DummyPipelineStack;
