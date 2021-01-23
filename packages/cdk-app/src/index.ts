import * as cdk from '@aws-cdk/core';
import * as utils from 'src/utils';
import PipelineStack from 'src/backend-stack/pipeline-stack';
import createDummyStack from './dummy-stack';

const app = new cdk.App();

// Dummy stack

// createDummyStack(app);

const pipelineStack = new PipelineStack(app, utils.getConstructId('pipeline'), {
    description: utils.getConstructId('pipeline'),
    env: {
        account: '694710432912',
        region: 'ap-southeast-1',
    },
});

app.synth();
