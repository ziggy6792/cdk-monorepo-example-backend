import User from 'src/domain/models/user';
import { CreateUserInput, UpdateUserInput } from 'src/modules/user/inputs';
import isAuthRole from 'src/middleware/is-auth-role';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import GetMeResolver from 'src/modules/user/resolvers/get-me';

const CrudResolvers = buildCrudResolvers('User', User, {
    crudProps: {
        create: { inputType: CreateUserInput, resolverProps: { one: { middleware: [isAuthRole] } } },
        update: { inputType: UpdateUserInput, resolverProps: { one: { middleware: [isAuthRole] } } },
        get: { resolverProps: { one: { middleware: [] }, many: { middleware: [] } } },
        delete: { resolverProps: { one: { middleware: [isAuthRole] } } },
    },
});

export default [...CrudResolvers, GetMeResolver];
