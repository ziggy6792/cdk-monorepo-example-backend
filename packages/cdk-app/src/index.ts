import * as cdk from '@aws-cdk/core';
import * as utils from 'src/utils';
import PipelineStack from 'src/backend-stack/pipeline-stack';

const app = new cdk.App();

// Dummy stack
// const stageName = 'dummy';

// const deploymentConfig = DEPLOYMENT_CONFIG[stageName];

// const stack = new DeploymentStack(app, `${PROJECT_NAME}-dummy-deployment`, {
//     stageName,
//     ssmFrontendBucket: `/cdk-monorepo-frontend/${stageName}/s3-bucket`,
//     ...deploymentConfig,
// });

// const dummyPipelineStack = new DummyPipelineStack(app, utils.getConstructId('pipeline'));

const pipelineStack = new PipelineStack(app, utils.getConstructId('pipeline'), {
    description: utils.getConstructId('pipeline'),
    env: {
        account: '694710432912',
        region: 'ap-southeast-1',
    },
});

app.synth();
