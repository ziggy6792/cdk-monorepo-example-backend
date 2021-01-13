/* eslint-disable max-len */
const mockEvent = {
  resource: '/internal/graphql',
  path: '/internal/graphql',
  httpMethod: 'POST',
  headers: {
    Accept: '*/*',
    'CloudFront-Forwarded-Proto': 'https',
    'CloudFront-Is-Desktop-Viewer': 'true',
    'CloudFront-Is-Mobile-Viewer': 'false',
    'CloudFront-Is-SmartTV-Viewer': 'false',
    'CloudFront-Is-Tablet-Viewer': 'false',
    'CloudFront-Viewer-Country': 'SG',
    'Content-Type': 'application/json',
    Host: 'mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com',
    'User-Agent': 'axios/0.19.2',
    Via: '1.1 ffa0d2acb6ab662531e95cf2a187fa41.cloudfront.net (CloudFront)',
    'X-Amz-Cf-Id': 'N7fyrqjzSlR5oW8Y6cIMhMlq26_wt3FyvlkSMUXE24hH-PF-nY3Hsw==',
    'x-amz-date': '20201215T065447Z',
    'X-Amz-Security-Token':
      'IQoJb3JpZ2luX2VjEE8aDmFwLXNvdXRoZWFzdC0xIkcwRQIhAJMSsU4LDGbCfrYgJ3BQ8Q2va/aLmtOX3mHCKqv6sJjBAiA8UDc4Dz6BC6IWZnXvs8a4b6axJkwgPdafQqnXiINdrSrrAQjo//////////8BEAAaDDY5NDcxMDQzMjkxMiIMzgUIk7KtGSOb8ccuKr8Be29CfK68dVdG5qyMrC3AmOJy+UABv7lB6TcR3cW0RqvaIHOlFuwo1cV7nZnMlZXbUzHTl+bufODkC9qXYG0GNL4Lq4QhXRE9F9JlqhQAVVOaOJ+rLnTfsbylCF04ebIadqpvm3qqL10yPu35fpaX4JVBTH3Rb6wem3CywFGiAW3vZFm7Vd3W5L6IJNHNfulq1o+PmQ4cCGMFsxd45NWcFsNFuf0Kvru7qFj6wV7XQpOOYjq5SbrfjLoXuT4x4i4wtbvh/gU64AEBO4Pe8wufuJrF7etgCxTFfNQbj64Z4YaOsBofRdyUGZ5g7L9M7byxO6cj8OZkp+XUmWmyHesnZWmIZS0LIN8MN17oeBOWOrBCVg7mskO4Tl1rtgZC8dof4mBDGOtPOygULLS/G2sSeTuRWDmBJwDpLQkm4Dw/ErkPujl5mVByupn3XBlhBQl3Q4X2BlxGZPvTPKjNPE6O2K5sTCJo2kZ8gpvg8a9tDffwnSPyOqPhfXTTjS6VG1bOep9UEtjnVDvY5U0HIMOgQzrP8PQbx6hMKJ4mlpol70eIvSYs0Pb03g==',
    'X-Amzn-Trace-Id': 'Root=1-5fd85db7-296450c750abf9423d0d1134',
    'X-Forwarded-For': '18.140.235.108, 130.176.75.132',
    'X-Forwarded-Port': '443',
    'X-Forwarded-Proto': 'https',
  },
  multiValueHeaders: {
    Accept: ['*/*'],
    'CloudFront-Forwarded-Proto': ['https'],
    'CloudFront-Is-Desktop-Viewer': ['true'],
    'CloudFront-Is-Mobile-Viewer': ['false'],
    'CloudFront-Is-SmartTV-Viewer': ['false'],
    'CloudFront-Is-Tablet-Viewer': ['false'],
    'CloudFront-Viewer-Country': ['SG'],
    'Content-Type': ['application/json'],
    Host: ['mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com'],
    'User-Agent': ['axios/0.19.2'],
    Via: ['1.1 ffa0d2acb6ab662531e95cf2a187fa41.cloudfront.net (CloudFront)'],
    'X-Amz-Cf-Id': ['N7fyrqjzSlR5oW8Y6cIMhMlq26_wt3FyvlkSMUXE24hH-PF-nY3Hsw=='],
    'x-amz-date': ['20201215T065447Z'],
    'X-Amz-Security-Token': [
      'IQoJb3JpZ2luX2VjEE8aDmFwLXNvdXRoZWFzdC0xIkcwRQIhAJMSsU4LDGbCfrYgJ3BQ8Q2va/aLmtOX3mHCKqv6sJjBAiA8UDc4Dz6BC6IWZnXvs8a4b6axJkwgPdafQqnXiINdrSrrAQjo//////////8BEAAaDDY5NDcxMDQzMjkxMiIMzgUIk7KtGSOb8ccuKr8Be29CfK68dVdG5qyMrC3AmOJy+UABv7lB6TcR3cW0RqvaIHOlFuwo1cV7nZnMlZXbUzHTl+bufODkC9qXYG0GNL4Lq4QhXRE9F9JlqhQAVVOaOJ+rLnTfsbylCF04ebIadqpvm3qqL10yPu35fpaX4JVBTH3Rb6wem3CywFGiAW3vZFm7Vd3W5L6IJNHNfulq1o+PmQ4cCGMFsxd45NWcFsNFuf0Kvru7qFj6wV7XQpOOYjq5SbrfjLoXuT4x4i4wtbvh/gU64AEBO4Pe8wufuJrF7etgCxTFfNQbj64Z4YaOsBofRdyUGZ5g7L9M7byxO6cj8OZkp+XUmWmyHesnZWmIZS0LIN8MN17oeBOWOrBCVg7mskO4Tl1rtgZC8dof4mBDGOtPOygULLS/G2sSeTuRWDmBJwDpLQkm4Dw/ErkPujl5mVByupn3XBlhBQl3Q4X2BlxGZPvTPKjNPE6O2K5sTCJo2kZ8gpvg8a9tDffwnSPyOqPhfXTTjS6VG1bOep9UEtjnVDvY5U0HIMOgQzrP8PQbx6hMKJ4mlpol70eIvSYs0Pb03g==',
    ],
    'X-Amzn-Trace-Id': ['Root=1-5fd85db7-296450c750abf9423d0d1134'],
    'X-Forwarded-For': ['18.140.235.108, 130.176.75.132'],
    'X-Forwarded-Port': ['443'],
    'X-Forwarded-Proto': ['https'],
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: null,
  stageVariables: null,
  requestContext: {
    resourceId: 'k8lpg8',
    resourcePath: '/internal/graphql',
    httpMethod: 'POST',
    extendedRequestId: 'XlOUwHA-SQ0Fpcw=',
    requestTime: '15/Dec/2020:06:54:47 +0000',
    path: '/staging/internal/graphql',
    accountId: '694710432912',
    protocol: 'HTTP/1.1',
    stage: 'staging',
    domainPrefix: 'mnakrqgp7b',
    requestTimeEpoch: 1608015287977,
    requestId: 'dd66b750-c03f-479e-bb63-2581f9b486db',
    identity: {
      cognitoIdentityPoolId: null,
      accountId: '694710432912',
      cognitoIdentityId: null,
      caller: 'AROA2DP7X6SIMRRFRXRBA:CDK-MonoRepo2-lambda-user-confirmed',
      sourceIp: '18.140.235.108',
      principalOrgId: null,
      accessKey: 'ASIA2DP7X6SIP6JFNRP6',
      cognitoAuthenticationType: null,
      cognitoAuthenticationProvider: null,
      userArn: 'arn:aws:sts::694710432912:assumed-role/CDK-MonoRepo2-CDKMonoRepo2lambdauserconfirmedServi-1HWFXUJQT4FGN/CDK-MonoRepo2-lambda-user-confirmed',
      userAgent: 'axios/0.19.2',
      user: 'AROA2DP7X6SIMRRFRXRBA:CDK-MonoRepo2-lambda-user-confirmed',
    },
    domainName: 'mnakrqgp7b.execute-api.ap-southeast-1.amazonaws.com',
    apiId: 'mnakrqgp7b',
  },
  isBase64Encoded: false,
};

export default mockEvent;