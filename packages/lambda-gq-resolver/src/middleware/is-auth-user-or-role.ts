import { MiddlewareFn } from 'type-graphql';

import { IContext, IdentityType } from 'src/types';

const isAuthUserOrRole: MiddlewareFn<IContext> = async ({ context: { identity } }, next) => {
    if (identity.type !== IdentityType.USER && identity.type !== IdentityType.ROLE) {
        // Role can do anyting
        throw new Error('not authenticated');
    }

    return next();
};

export default isAuthUserOrRole;
