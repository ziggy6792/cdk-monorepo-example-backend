/* eslint-disable no-case-declarations */
/* eslint-disable no-fallthrough */
/* eslint-disable no-new */
import * as cdk from '@aws-cdk/core';
import * as utils from 'src/utils';
import * as config from 'src/config';
import PipelineStack from 'src/stacks/pipeline-stack';
import createDummyStack from 'src/dummy-stacks/dummy-deployment-stack';
import LocalTestStack from 'src/local-stacks/local-test-stack';

const app = new cdk.App();

const context = JSON.parse(process.env.CDK_CONTEXT_JSON);

// console.log(context);
// console.log(context.env);

enum EnvType {
    PIPELINE = 'pipeline',
    TEST = 'test',
    DUMMY = 'dummy',
}

context.env = context.env || EnvType.PIPELINE;

console.log('environment:', context.env);

switch (context.env) {
    case EnvType.TEST:
        const env = {
            account: process.env.CDK_DEFAULT_ACCOUNT || '000000000000',
            region: process.env.CDK_DEFAULT_REGION || 'ap-southeast-1',
        };
        // console.log('process.env', JSON.stringify(process.env));

        console.log('default env', env);
        new LocalTestStack(app, utils.getConstructId(`local-test`), {
            stageName: 'test',
            env,
        });
        break;
    case EnvType.DUMMY:
        createDummyStack(app);
        break;
    default:
        new PipelineStack(app, utils.getConstructId('pipeline'), {
            description: utils.getConstructId('pipeline'),
            env: {
                account: config.AWS_ACCOUNT_ID,
                region: config.AWS_REGION,
            },
        });
}

// new LocalTestStack(app, utils.getConstructId('local-test'), {
//     stageName: 'test',
// });

app.synth();
