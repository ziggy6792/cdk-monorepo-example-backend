#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import PipelineStack from '../lib/pipeline-stack';
import * as util from '../util';

// const app = new cdk.App();
// const stack = new PackagesStack(app, PROJECT_NAME);

const app = new cdk.App();
const pipelineStack = new PipelineStack(app, util.getConstructId('pipeline'), {
  description: util.getConstructId('pipeline'),
  env: {
    account: '694710432912',
    region: 'ap-southeast-1',
  },
});

app.synth();
