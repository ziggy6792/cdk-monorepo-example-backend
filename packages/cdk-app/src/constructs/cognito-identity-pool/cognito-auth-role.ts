import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as cognito from '@aws-cdk/aws-cognito';

interface ICognitoAuthRoleProps {
  identityPool: cognito.CfnIdentityPool;
  authType: 'authenticated' | 'unauthenticated';
}

class CognitoAuthRole extends cdk.Construct {
  // Public reference to the IAM role
  role: iam.Role;

  constructor(scope: cdk.Construct, id: string, { identityPool, authType }: ICognitoAuthRoleProps) {
    super(scope, id);

    // IAM role used for authenticated users
    this.role = new iam.Role(this, 'CognitoDefaultAuthenticatedRole', {
      assumedBy: new iam.FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': authType,
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
    });
    this.role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['mobileanalytics:PutEvents', 'cognito-sync:*', 'cognito-identity:*'],
        resources: ['*'],
      })
    );
  }
}

export default CognitoAuthRole;
