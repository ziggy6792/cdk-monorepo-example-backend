import * as cdk from '@aws-cdk/core';
import * as utils from 'src/utils';
import * as config from 'src/config';
import PipelineStack from 'src/stacks/pipeline-stack';
import createDummyStack from 'src/dummy-stacks/dummy-deployment-stack';
import LocalTestStack from 'src/local-stacks/local-test-stack';

const app = new cdk.App({ context: { custom: 'bla bla bla' } });

// console.log('context', app.node.tryGetContext('custom'));
// console.log('context', app.node.tryGetContext('@aws-cdk/core:newStyleStackSynthesis'));

// console.log(JSON.parse(process.env.npm_config_argv));

// console.log(JSON.parse(process.env.CDK_CONTEXT_JSON));

// Dummy stack
createDummyStack(app);

const context = JSON.parse(process.env.CDK_CONTEXT_JSON);

if (context['@aws-cdk/core:newStyleStackSynthesis']) {
    // eslint-disable-next-line no-constant-condition
    const pipelineStack = new PipelineStack(app, utils.getConstructId('pipeline'), {
        stackName: 'stack1',
        description: utils.getConstructId('pipeline'),
        env: {
            account: config.AWS_ACCOUNT_ID,
            region: config.AWS_REGION,
        },
    });
} else {
    const testStack = new LocalTestStack(app, utils.getConstructId('local-test'), {
        stackName: 'stack2',
        stageName: 'test',
    });
}

// Dummy pipline stack
// const dummyPipelineStack = new DummyPipelineStack(app, utils.getConstructId('pipeline'));

app.synth();
