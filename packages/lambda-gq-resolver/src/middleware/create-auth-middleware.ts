/* eslint-disable no-await-in-loop */
import { MiddlewareFn, ResolverData } from 'type-graphql';
import { IContext } from 'src/types';
import errorMessage from 'src/config/error-message';

export type AuthCheck = (action: ResolverData<IContext>) => Promise<boolean>;

const checkAuth = async (authChecks: AuthCheck[], action: ResolverData<IContext>): Promise<boolean> => {
    // const results = await Promise.all(authChecks);

    for (let i = 0; i < authChecks.length; i++) {
        try {
            const result = await authChecks[i](action);
            if (result) {
                return true;
            }
        } catch (err) {
            console.log(err);
        }
    }

    return false;
};

const createAuthMiddleware = (authCheckers: AuthCheck[]): MiddlewareFn<IContext> => {
    const retMiddleware: MiddlewareFn<IContext> = async (action, next) => {
        const isAuthorized = await checkAuth(authCheckers, action);
        if (!isAuthorized) {
            throw new Error(errorMessage.notAuthenticated);
        }

        return next();
    };
    return retMiddleware;
};

export default createAuthMiddleware;
