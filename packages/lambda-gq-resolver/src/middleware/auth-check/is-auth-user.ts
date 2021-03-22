import { IdentityType } from 'src/types';
import { AuthCheck } from './types';

export const isAuthUser: AuthCheck = async ({ context: { identity } }) => [IdentityType.USER].includes(identity.type);

export default isAuthUser;
