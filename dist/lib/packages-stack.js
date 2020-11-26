"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackagesStack = void 0;
const tslib_1 = require("tslib");
const sns = tslib_1.__importStar(require("@aws-cdk/aws-sns"));
const subs = tslib_1.__importStar(require("@aws-cdk/aws-sns-subscriptions"));
const sqs = tslib_1.__importStar(require("@aws-cdk/aws-sqs"));
const cdk = tslib_1.__importStar(require("@aws-cdk/core"));
const lambda = tslib_1.__importStar(require("@aws-cdk/aws-lambda"));
const path_1 = tslib_1.__importDefault(require("path"));
class PackagesStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const queue = new sqs.Queue(this, 'PackagesQueue', {
            visibilityTimeout: cdk.Duration.seconds(300)
        });
        const topic = new sns.Topic(this, 'PackagesTopic');
        topic.addSubscription(new subs.SqsSubscription(queue));
        const lambdaA = new lambda.Function(this, 'lambda-a', {
            functionName: 'lambda-a',
            memorySize: 256,
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path_1.default.join(require.resolve('@danielblignaut/lambda-a'), '..')),
        });
        const lambdaB = new lambda.Function(this, 'lambda-b', {
            functionName: 'lambda-b',
            memorySize: 256,
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path_1.default.join(require.resolve('@danielblignaut/lambda-b'), '..')),
        });
    }
}
exports.PackagesStack = PackagesStack;
//# sourceMappingURL=packages-stack.js.map