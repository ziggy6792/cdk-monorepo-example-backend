import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as cognito from '@aws-cdk/aws-cognito';
import CognitoAuthRole from './cognito-auth-role';

interface ICognitoAuthRoleProps {
  identityPoolProps: cognito.CfnIdentityPoolProps;
}

class CognitoIdentityPool extends cdk.Construct {
  // Public reference to the IAM role
  readonly identityPool: cognito.CfnIdentityPool;

  readonly authentictedRole: iam.Role;

  readonly unauthenticatedRole: iam.Role;

  constructor(scope: cdk.Construct, id: string, { identityPoolProps }: ICognitoAuthRoleProps) {
    super(scope, id);

    this.identityPool = new cognito.CfnIdentityPool(this, id, identityPoolProps);

    const authenticatedRole = new CognitoAuthRole(this, 'AuthRole', {
      identityPool: this.identityPool,
      authType: 'authenticated',
    });

    this.authentictedRole = authenticatedRole.role;

    if (identityPoolProps.allowUnauthenticatedIdentities) {
      const unauthenticatedRole = new CognitoAuthRole(this, 'UnauthRole', {
        identityPool: this.identityPool,
        authType: 'unauthenticated',
      });

      this.unauthenticatedRole = unauthenticatedRole.role;
    }

    const roleAttatchment = new cognito.CfnIdentityPoolRoleAttachment(this, 'RoleAttachment', {
      identityPoolId: this.identityPool.ref,
      roles: { authenticated: this.authentictedRole.roleArn, unauthenticated: this.unauthenticatedRole?.roleArn },
    });

    // defaults.printWarning(id);
    // defaults.printWarning(generateConstructId('UnAuthRole'));
  }
}

export default CognitoIdentityPool;
