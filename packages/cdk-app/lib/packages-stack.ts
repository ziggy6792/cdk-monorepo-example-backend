import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import path from 'path';
export class PackagesStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'PackagesQueue', {
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    const topic = new sns.Topic(this, 'PackagesTopic');

    topic.addSubscription(new subs.SqsSubscription(queue));

    const lambdaA = new lambda.Function(this, 'lambda-a', {
      functionName: 'lambda-a',
      memorySize: 256,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(require.resolve('@danielblignaut/lambda-a'), '..')),
    });

    const lambdaB = new lambda.Function(this, 'lambda-b', {
      functionName: 'lambda-b',
      memorySize: 256,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(require.resolve('@danielblignaut/lambda-b'), '..')),
    });

    const lambdaGqResolber = new lambda.Function(this, 'lambda-gq-resolver', {
      functionName: 'lambda-gq-resolver',
      memorySize: 256,
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(require.resolve('@danielblignaut/lambda-gq-resolver'), '..')),
    });
  }
}
