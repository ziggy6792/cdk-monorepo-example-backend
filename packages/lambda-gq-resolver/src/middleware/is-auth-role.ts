import { MiddlewareFn, ResolverData } from 'type-graphql';

import { IContext, IdentityType } from 'src/types';
import errorMessage from 'src/config/error-message';

export const getIsAuthRole = ({ context: { identity } }: ResolverData<IContext>): boolean => [IdentityType.ROLE].includes(identity.type);

const isAuthRole: MiddlewareFn<IContext> = async (action, next) => {
    if (!getIsAuthRole(action)) {
        throw new Error(errorMessage.notAuthenticated);
    }

    return next();
};

export default isAuthRole;
