import { IdentityType } from 'src/types';
import { createOrAuthMiddleware, AuthCheck } from './create-auth-middleware';

export const isAuthRole: AuthCheck = async ({ context: { identity } }) => [IdentityType.ROLE].includes(identity.type);

const isAuthRoleMiddleware = createOrAuthMiddleware([isAuthRole]);

export default isAuthRoleMiddleware;
