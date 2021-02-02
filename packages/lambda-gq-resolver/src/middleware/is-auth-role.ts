import { MiddlewareFn } from 'type-graphql';

import { IContext, IdentityType } from 'src/types';

const isAuthRole: MiddlewareFn<IContext> = async ({ context: { identity } }, next) => {
    if (identity.type !== IdentityType.ROLE) {
        throw new Error('not authenticated');
    }

    return next();
};

export default isAuthRole;
