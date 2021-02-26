import { IdentityType } from 'src/types';
import createAuthMiddleware, { AuthCheck } from './create-auth-middleware';
import { getIsAuthRole } from './is-auth-role';

export const getIsAuthUser: AuthCheck = async ({ context: { identity } }) => [IdentityType.USER].includes(identity.type);

export default createAuthMiddleware([getIsAuthUser, getIsAuthRole]);
