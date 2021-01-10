/* eslint-disable import/prefer-default-export */
import * as cdk from '@aws-cdk/core';

import { Stack, StackProps, Construct, SecretValue } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';
import * as cdkPipeline from '@aws-cdk/pipelines';
import * as iam from '@aws-cdk/aws-iam';

import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import { DeploymentStage } from './deployment-stage';
import * as utils from '../utils';

class PipelineStack extends Stack {
  public readonly stagingUrlOutput: cdk.CfnOutput;

  public readonly prodUrlOutput: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, utils.getConstructId('pipeline'), {
      pipelineName: utils.getConstructId('pipeline'),
      cloudAssemblyArtifact,

      sourceAction: new codepipelineActions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('GITHUB_OATH_TOKEN', { jsonField: 'GITHUB_OATH_TOKEN' }),
        trigger: codepipelineActions.GitHubTrigger.POLL,
        // Replace these with your actual GitHub project info
        owner: 'ziggy6792',
        repo: 'cdk-monorepo-example-backend',
        branch: 'feature/add-tests-to-pipeline',
      }),

      synthAction: SimpleSynthAction.standardYarnSynth({
        sourceArtifact,
        cloudAssemblyArtifact,

        // Use this if you need a build step (if you're not using ts-node
        // or if you have TypeScript Lambdas that need to be compiled).
        // installCommand: 'yarn install',
        buildCommand: 'yarn build',
        synthCommand: 'yarn cdk:synth',
        // subdirectory: 'packages/cdk-app',
      }),
    });

    const exampleAction = new cdkPipeline.ShellScriptAction({
      actionName: 'Example',
      additionalArtifacts: [sourceArtifact],
      runOrder: 1,
      // 'test.sh' comes from the source repository
      commands: ['ls'],
    });

    pipeline.codePipeline.stages[1].addAction(exampleAction);

    // const testingStage = new cdkPipeline.CdkStage(this, utils.getConstructId('test'), { stageName: 'testing', pipelineStage: { actions: [] } });

    const testingStage = pipeline.addStage('Test');

    const testAction = new cdkPipeline.ShellScriptAction({
      actionName: 'Test',
      additionalArtifacts: [sourceArtifact],

      // 'test.sh' comes from the source repository
      commands: ['yarn install', 'yarn build', 'yarn test'],
    });

    testingStage.addActions(testAction);

    testAction.project.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMFullAccess'));

    // Do this as many times as necessary with any account and region
    // Account and region may be different from the pipeline's.

    const deployedStagingStage = new DeploymentStage(this, utils.getConstructId('staging'), {
      stageName: 'staging',
      env: {
        account: '694710432912',
        region: 'ap-southeast-1',
      },
    });

    // deployedStagingStage.

    // const testingStage = pipeline.addStage(new MyApplication(this, 'Testing', {
    //   env: { account: '111111111111', region: 'eu-west-1' }
    // }));

    const stagingStage = pipeline.addApplicationStage(deployedStagingStage);

    // devStage.addActions(new ManualApprovalAction({
    //   actionName: 'ManualApproval',
    //   runOrder: testingStage.nextSequentialRunOrder(),
    // }));

    // pipeline.

    // Manual Approval
    // devStage.addActions(
    //   new ManualApprovalAction({
    //     actionName: 'ManualApproval',
    //     runOrder: devStage.nextSequentialRunOrder(),
    //   })
    // );

    // Do this as many times as necessary with any account and region
    // Account and region may be different from the pipeline's.

    const deployedProdStage = new DeploymentStage(this, utils.getConstructId('prod'), {
      stageName: 'prod',
      env: {
        account: '694710432912',
        region: 'ap-southeast-1',
      },
    });

    pipeline.addApplicationStage(deployedProdStage);

    // if (deployedProdStage.urlOutput.exportName) {
    //   this.prodUrlOutput = new cdk.CfnOutput(this, deployedProdStage.urlOutput.exportName, { value: deployedProdStage.urlOutput.importValue });
    // }
    // this.devUrlOutput = new cdk.CfnOutput(this, 'webservice-prod', { value: Fn.importValue('webservice-prod') });

    // this.urlOutput = service.urlOutput;
  }
}

export default PipelineStack;
