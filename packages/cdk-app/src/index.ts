import * as cdk from '@aws-cdk/core';
import * as utils from 'src/utils';
import * as config from 'src/config';
import PipelineStack from 'src/stacks/pipeline-stack';
import createDummyStack from 'src/dummy-stacks/dummy-deployment-stack';
import LocalTestStack from 'src/local-stacks/local-test-stack';

const app = new cdk.App();

// Dummy stack
createDummyStack(app);

const testStack = new LocalTestStack(app, utils.getConstructId('local-test'), {
    stageName: 'test',
});

console.log('context', app.node.tryGetContext('custom'));
console.log('context', app.node.tryGetContext('@aws-cdk/core:newStyleStackSynthesis'));

console.log(JSON.parse(process.env.npm_config_argv));

const context = JSON.parse(process.env.CDK_CONTEXT_JSON);

console.log(JSON.parse(process.env.CDK_CONTEXT_JSON));

if (context['@aws-cdk/core:newStyleStackSynthesis']) {
    // eslint-disable-next-line no-constant-condition
    const pipelineStack = new PipelineStack(app, utils.getConstructId('pipeline'), {
        description: utils.getConstructId('pipeline'),
        env: {
            account: config.AWS_ACCOUNT_ID,
            region: config.AWS_REGION,
        },
    });
}

// Dummy pipline stack
// const dummyPipelineStack = new DummyPipelineStack(app, utils.getConstructId('pipeline'));

app.synth();
