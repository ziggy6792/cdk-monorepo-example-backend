import User from 'src/domain/models/user';
import { CreateUserInput, UpdateUserInput } from 'src/resolvers/crud/user/inputs';
import deafultAuthMiddleware from 'src/middleware/default-auth-middleware';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import GetMeResolver from 'src/resolvers/crud/user/experiments/get-me';
import { AuthCheck } from 'src/middleware/auth-check/types';
import { IdentityType } from 'src/types';
import errorMessage from 'src/config/error-message';
import createAuthMiddleware from 'src/middleware/create-auth-middleware';
import isAuthRole from 'src/middleware/auth-check/is-auth-role';

const isAllowedToEditUser: AuthCheck = async ({ args, context: { identity } }) => {
    if (identity.type !== IdentityType.USER) {
        throw new Error(errorMessage.auth.authTypeNotUser);
    }
    const input = args.input as UpdateUserInput;

    const user = await User.store.get(input.id).exec();

    if (user.id === identity.user?.username) {
        return true;
    }

    throw new Error(errorMessage.auth.notYou);
};

const CrudResolvers = buildCrudResolvers('User', User, {
    crudProps: {
        create: { inputType: CreateUserInput, resolverProps: { one: { middleware: [deafultAuthMiddleware] } } },
        update: { inputType: UpdateUserInput, resolverProps: { one: { middleware: [createAuthMiddleware([isAllowedToEditUser])] } } },
        get: { resolverProps: { one: true, many: true } },
        delete: { resolverProps: { one: { middleware: [deafultAuthMiddleware] } } },
    },
});

export default [...CrudResolvers, GetMeResolver];
