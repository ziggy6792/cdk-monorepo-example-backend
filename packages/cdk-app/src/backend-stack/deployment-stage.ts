/* eslint-disable import/prefer-default-export */

import * as cdk from '@aws-cdk/core';
import { DEPLOYMENT_CONFIG } from 'src/config';
import { DeploymentStack } from './deployment-stack';

export interface DeploymentStageProps extends cdk.StackProps {
    readonly stageName: string;
}

export class DeploymentStage extends cdk.Stage {
    public readonly urlOutput: cdk.CfnOutput;
    // public stack: ApigwDemoStack;

    constructor(scope: cdk.Construct, id: string, props?: DeploymentStageProps) {
        super(scope, id, props);

        const { stageName } = props;

        const stageConfig = DEPLOYMENT_CONFIG[stageName];

        const stack = new DeploymentStack(this, 'deployment', {
            stageName,
            ssmFrontendBucket: `/cdk-monorepo-frontend/${stageName}/s3-bucket`,
            ...stageConfig,
        });

        // defaults.printWarning(websiteFolder);

        // this.stack = service;
        // this.urlOutput = new cdk.CfnOutput(scope, `${stackName}-${id}`, { value: Fn.importValue('url') });
        // this.urlOutput = new cdk.CfnOutput(this, `${stackName}-${id}`, { value: service.urlOutput });
    }
}
