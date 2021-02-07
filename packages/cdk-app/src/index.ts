import * as cdk from '@aws-cdk/core';
import * as utils from 'src/utils';
import * as config from 'src/config';
import PipelineStack from 'src/stacks/pipeline-stack';
import createDummyStack from 'src/dummy-stacks/dummy-deployment-stack';
import LocalTestStack from 'src/local-stacks/local-test-stack';

const app = new cdk.App();

const context = JSON.parse(process.env.CDK_CONTEXT_JSON);

console.log(context);

// Dummy stack
createDummyStack(app);

const pipelineStack = new PipelineStack(app, utils.getConstructId('pipeline'), {
    description: utils.getConstructId('pipeline'),
    env: {
        account: config.AWS_ACCOUNT_ID,
        region: config.AWS_REGION,
    },
});

const testStack = new LocalTestStack(app, utils.getConstructId('local-test'), {
    stageName: 'test',
});

app.synth();
