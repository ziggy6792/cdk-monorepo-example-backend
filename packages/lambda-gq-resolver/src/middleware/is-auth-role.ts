import { IdentityType } from 'src/types';
import { createOrAuthMiddleware, AuthCheck } from './create-auth-middleware';

// For dev auth-none is also treated as role auth. Should be turned off fot production
export const isAuthRole: AuthCheck = async ({ context: { identity } }) => [IdentityType.ROLE, IdentityType.NONE].includes(identity.type);

const isAuthRoleMiddleware = createOrAuthMiddleware([isAuthRole]);

export default isAuthRoleMiddleware;
