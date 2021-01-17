import * as cdk from '@aws-cdk/core';
import { PROJECT_NAME } from 'src/config';
import * as utils from 'src/utils';
import { DeploymentStack } from 'src/backend-stack/deployment-stack';
import DummyPipelineStack from 'src/backend-stack/dummy-pipeline-stack';
import PipelineStack from 'src/backend-stack/pipeline-stack';

const app = new cdk.App();

// const stack = new DeploymentStack(app, `${PROJECT_NAME}-staging-deployment`, { stage: 'staging' });

// const dummyPipelineStack = new DummyPipelineStack(app, utils.getConstructId('pipeline'));

const pipelineStack = new PipelineStack(app, utils.getConstructId('pipeline'), {
  description: utils.getConstructId('pipeline'),
  env: {
    account: '694710432912',
    region: 'ap-southeast-1',
  },
});

app.synth();
