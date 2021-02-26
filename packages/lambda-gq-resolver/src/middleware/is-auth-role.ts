import { IdentityType } from 'src/types';
import createAuthMiddleware, { AuthCheck } from './create-auth-middleware';

export const getIsAuthRole: AuthCheck = async ({ context: { identity } }) => [IdentityType.ROLE].includes(identity.type);

const isAuthRoleMiddleware = createAuthMiddleware([getIsAuthRole]);

export default isAuthRoleMiddleware;
