import { MiddlewareFn, ResolverData } from 'type-graphql';

import { IContext, IdentityType } from 'src/types';
import errorMessage from 'src/config/error-message';
import { getIsAuthRole } from './is-auth-role';

export const getIsAuthUserOrRole = (action: ResolverData<IContext>): boolean => {
    const {
        context: { identity },
    } = action;
    return getIsAuthRole(action) || identity.type === IdentityType.USER;
};

const isAuthUserOrRole: MiddlewareFn<IContext> = async (action, next) => {
    if (!getIsAuthUserOrRole(action)) {
        throw new Error(errorMessage.notAuthenticated);
    }

    return next();
};

export default isAuthUserOrRole;
