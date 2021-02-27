/* eslint-disable no-await-in-loop */
import { MiddlewareFn, ResolverData } from 'type-graphql';
import { IContext } from 'src/types';
import errorMessage from 'src/config/error-message';
import { AuthCheck } from './auth-check/types';

const checkAuth = async (authChecks: AuthCheck[], action: ResolverData<IContext>): Promise<boolean> => {
    const errors = [];
    for (let i = 0; i < authChecks.length; i++) {
        try {
            const result = await authChecks[i](action);
            if (result) {
                return true;
            }
        } catch (err) {
            errors.push(err);
            console.log('auth check returned error', err);
        }
    }
    if (errors) {
        throw new Error(`Authentication Errors: ${errors.map((err) => err.message).join('\n')}`);
    }

    return false;
};

// Does an or on all auth checks returns false if no auth checks pass
const createAuthMiddleware = (authChecks: AuthCheck[]): MiddlewareFn<IContext> => {
    const retMiddleware: MiddlewareFn<IContext> = async (action, next) => {
        const isAuthorized = await checkAuth(authChecks, action);
        if (!isAuthorized) {
            throw new Error(errorMessage.notAuthenticated);
        }

        return next();
    };
    return retMiddleware;
};

export default createAuthMiddleware;
