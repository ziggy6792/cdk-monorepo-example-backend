/* eslint-disable import/prefer-default-export */
import * as cdk from '@aws-cdk/core';

import * as cdkPipeline from '@aws-cdk/pipelines';
import * as iam from '@aws-cdk/aws-iam';

import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as utils from 'src/utils';
import { DeploymentStage } from './deployment-stage';

class PipelineStack extends cdk.Stack {
    public readonly stagingUrlOutput: cdk.CfnOutput;

    public readonly prodUrlOutput: cdk.CfnOutput;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const sourceArtifact = new codepipeline.Artifact();
        const cloudAssemblyArtifact = new codepipeline.Artifact();

        const pipeline = new cdkPipeline.CdkPipeline(this, utils.getConstructId('pipeline'), {
            pipelineName: utils.getConstructId('pipeline'),
            cloudAssemblyArtifact,

            sourceAction: new codepipelineActions.GitHubSourceAction({
                actionName: 'GitHub',
                output: sourceArtifact,
                oauthToken: cdk.SecretValue.secretsManager('GITHUB_OATH_TOKEN', { jsonField: 'GITHUB_OATH_TOKEN' }),
                trigger: codepipelineActions.GitHubTrigger.POLL,
                // Replace these with your actual GitHub project info
                owner: 'ziggy6792',
                repo: 'cdk-monorepo-example-backend',
                branch: 'feature/runtime-config-2',
            }),

            synthAction: cdkPipeline.SimpleSynthAction.standardYarnSynth({
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

        // const exampleAction = new cdkPipeline.ShellScriptAction({
        //   actionName: 'Example',
        //   additionalArtifacts: [sourceArtifact],
        //   runOrder: 1,
        //   // 'test.sh' comes from the source repository
        //   commands: ['ls'],
        // });

        const testAction = new cdkPipeline.ShellScriptAction({
            actionName: 'Test',
            additionalArtifacts: [sourceArtifact],
            runOrder: 1,
            commands: ['yarn install', 'yarn build', 'yarn test:with:env'],
        });

        pipeline.codePipeline.stages[1].addAction(testAction);

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

        const stagingStage = pipeline.addApplicationStage(deployedStagingStage);

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
    }
}

export default PipelineStack;
