import isAuthRole from './auth-check/is-auth-role';
import createAuthMiddleware from './create-auth-middleware';

const isAuthRoleMiddleware = createAuthMiddleware([isAuthRole]);

export default isAuthRoleMiddleware;
