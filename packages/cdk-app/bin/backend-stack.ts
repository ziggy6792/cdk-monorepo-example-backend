import * as cdk from '@aws-cdk/core';
import { PROJECT_NAME } from 'lib/config';
import * as utils from 'lib/utils';
import { DeploymentStack } from 'lib/backend-stack/deployment-stack';
import DummyPipelineStack from 'lib/backend-stack/dummy-pipeline-stack';
import PipelineStack from 'lib/backend-stack/pipeline-stack';

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
