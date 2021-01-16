/* eslint-disable import/prefer-default-export */
import * as cdk from '@aws-cdk/core';

import { Stack, StackProps, Construct, SecretValue } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';

import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import { DEPLOYMENT_CONFIG } from '../config/index';
import { DeploymentStage } from './deployment-stage';
import { DeploymentStack } from './deployment-stack';
import { PROJECT_NAME } from '../config';

class DummyPipelineStack extends Stack {
  public readonly stagingUrlOutput: cdk.CfnOutput;

  public readonly prodUrlOutput: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const stages = ['deployment', 'prod'];

    stages.forEach((stageName) => {
      const stagingConfig = DEPLOYMENT_CONFIG[stageName];
      const stagingDeployment = new DeploymentStack(this, `${PROJECT_NAME}-${stageName}-deployment`, { stageName, ...stagingConfig });
    });
  }
}

export default DummyPipelineStack;
