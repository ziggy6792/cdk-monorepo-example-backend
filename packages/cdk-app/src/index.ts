import * as cdk from '@aws-cdk/core';
import * as utils from 'src/utils';
import PipelineStack from 'src/backend-stack/pipeline-stack';
import * as config from 'src/config';

const app = new cdk.App();

// Dummy stack
// createDummyStack(app);

// Dummy pipline stack
// const dummyPipelineStack = new DummyPipelineStack(app, utils.getConstructId('pipeline'));

const pipelineStack = new PipelineStack(app, utils.getConstructId('pipeline'), {
    description: utils.getConstructId('pipeline'),
    env: {
        account: config.AWS_ACCOUNT_ID,
        region: config.AWS_REGION,
    },
});

app.synth();
