/* eslint-disable import/prefer-default-export */
import * as cdk from '@aws-cdk/core';

import { Stack, StackProps, Construct, SecretValue } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';

import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import { DeploymentStage } from './deployment-stage';
import { DeploymentStack } from './deployment-stack';
import { PROJECT_NAME } from '../config';

class DummyPipelineStack extends Stack {
  public readonly stagingUrlOutput: cdk.CfnOutput;

  public readonly prodUrlOutput: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const stagingDeployment = new DeploymentStack(this, `${PROJECT_NAME}-staging-deployment`, { stage: 'staging' });
    const prodDeployment = new DeploymentStack(this, `${PROJECT_NAME}-prod-deployment`, { stage: 'prod' });
  }
}

export default DummyPipelineStack;
