import { IdentityType } from 'src/types';
import { AuthCheck } from './types';

// For dev auth-none is also treated as role auth. Should be turned off fot production
export const isAuthRole: AuthCheck = async ({ context: { identity } }) => [IdentityType.ROLE, IdentityType.NONE].includes(identity.type);

export default isAuthRole;
