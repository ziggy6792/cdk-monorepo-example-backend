import User from 'src/domain/models/user';
import { CreateUserInput, UpdateUserInput } from 'src/modules/user/inputs';
import isAuthRoleMiddleware from 'src/middleware/is-auth-role-middleware';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import GetMeResolver from 'src/modules/user/resolvers/get-me';

const CrudResolvers = buildCrudResolvers('User', User, {
    crudProps: {
        create: { inputType: CreateUserInput, resolverProps: { one: { middleware: [isAuthRoleMiddleware] } } },
        update: { inputType: UpdateUserInput, resolverProps: { one: { middleware: [isAuthRoleMiddleware] } } },
        get: { resolverProps: { one: true, many: true } },
        delete: { resolverProps: { one: { middleware: [isAuthRoleMiddleware] } } },
    },
});

export default [...CrudResolvers, GetMeResolver];
