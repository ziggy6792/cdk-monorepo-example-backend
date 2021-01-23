const mockEvent = {
    version: '0',
    id: '8f1aeadd-5dcc-cc3e-7de5-283edf5c0d67',
    'detail-type': 'Parameter Store Change',
    source: 'aws.ssm',
    account: '694710432912',
    time: '2021-01-20T18:25:18Z',
    region: 'ap-southeast-1',
    resources: ['arn:aws:ssm:ap-southeast-1:694710432912:parameter/cdk-monorepo-backend/staging/frontend-config'],
    detail: {
        name: '/cdk-monorepo-backend/staging/frontend-config',
        type: 'String',
        operation: 'Update',
    },
};

export default mockEvent;
