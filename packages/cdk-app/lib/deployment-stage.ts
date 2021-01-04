/* eslint-disable import/prefer-default-export */
import { Construct, Stage, StageProps } from '@aws-cdk/core';

import * as cdk from '@aws-cdk/core';
import * as defaults from '@aws-solutions-constructs/core';
import * as path from 'path';
import { DeploymentStack } from './deployment-stack';

export interface DeploymentStackProps extends cdk.StackProps {
  readonly stageName: string;
}

export class DeploymentStage extends Stage {
  public readonly urlOutput: cdk.CfnOutput;
  // public stack: ApigwDemoStack;

  constructor(scope: Construct, id: string, props?: DeploymentStackProps) {
    super(scope, id, props);

    const { stageName } = props;

    const stack = new DeploymentStack(this, 'deployment', { stageName });

    // defaults.printWarning(websiteFolder);

    // this.stack = service;
    // this.urlOutput = new cdk.CfnOutput(scope, `${stackName}-${id}`, { value: Fn.importValue('url') });
    // this.urlOutput = new cdk.CfnOutput(this, `${stackName}-${id}`, { value: service.urlOutput });
  }
}
