import { MiddlewareFn } from 'type-graphql';

import { Context, IdentityType } from 'src/types';

const isAuthRole: MiddlewareFn<Context> = async ({ context: { identity } }, next) => {
    if (identity.type !== IdentityType.ROLE) {
        throw new Error('not authenticated');
    }

    return next();
};

export default isAuthRole;
