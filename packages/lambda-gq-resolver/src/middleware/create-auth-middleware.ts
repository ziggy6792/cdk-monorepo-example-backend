/* eslint-disable no-await-in-loop */
import { MiddlewareFn, ResolverData } from 'type-graphql';
import { IContext } from 'src/types';
import errorMessage from 'src/config/error-message';

export type AuthCheck = (action: ResolverData<IContext>) => Promise<boolean>;

const checkAuth = async (authChecks: AuthCheck[], action: ResolverData<IContext>): Promise<boolean> => {
    for (let i = 0; i < authChecks.length; i++) {
        try {
            const result = await authChecks[i](action);
            if (result) {
                return true;
            }
        } catch (err) {
            console.log('auth check returned error', err);
        }
    }

    return false;
};

// Does an or on all auth checks returns false if no auth checks pass
export const createOrAuthMiddleware = (authChecks: AuthCheck[]): MiddlewareFn<IContext> => {
    const retMiddleware: MiddlewareFn<IContext> = async (action, next) => {
        const isAuthorized = await checkAuth(authChecks, action);
        if (!isAuthorized) {
            throw new Error(errorMessage.notAuthenticated);
        }

        return next();
    };
    return retMiddleware;
};
