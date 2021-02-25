import { MiddlewareFn } from 'type-graphql';

import { IContext, IdentityType } from 'src/types';

const isAuthRole: MiddlewareFn<IContext> = async ({ context: { identity } }, next) => {
    // No auth is treated as role for development
    if (![IdentityType.ROLE, IdentityType.NONE].includes(identity.type)) {
        throw new Error('not authenticated');
    }

    return next();
};

export default isAuthRole;
