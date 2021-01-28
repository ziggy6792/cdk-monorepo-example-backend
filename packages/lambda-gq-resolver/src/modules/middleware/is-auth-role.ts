import { MiddlewareFn } from 'type-graphql';

import { Context } from 'src/types';

export const isAuthUser: MiddlewareFn<Context> = async ({ context: { identity } }, next) => {
    if (!identity?.username) {
        throw new Error('not authenticated');
    }

    return next();
};

export default isAuthUser;
