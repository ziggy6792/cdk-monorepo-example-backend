import * as apigw from '@aws-cdk/aws-apigateway';

export default function addCorsOptions(apiResource: apigw.IResource): void {
  apiResource.addMethod(
    'OPTIONS',
    new apigw.MockIntegration({
      integrationResponses: [
        {
          statusCode: '200',
          // contentHandling: apigw.ContentHandling.CONVERT_TO_TEXT,
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Credentials': "'false'",
            'method.response.header.Access-Control-Allow-Methods': "'GET,OPTIONS'", // modify this based on methods
          },
        },
      ],
      passthroughBehavior: apigw.PassthroughBehavior.WHEN_NO_MATCH,
      requestTemplates: {
        'application/json': '{"statusCode": 200}',
      },
    }),
    {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Methods': true,
            'method.response.header.Access-Control-Allow-Credentials': true, // COGNITO
            'method.response.header.Access-Control-Allow-Origin': true,
          },
        },
      ],
    }
  );
}
