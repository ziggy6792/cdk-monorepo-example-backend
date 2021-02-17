import User from 'src/domain/models/user';
import { CreateUserInput, UpdateUserInput } from 'src/modules/user/inputs';
import isAuthRole from 'src/middleware/is-auth-role';
import createCrudResolvers from 'src/higher-order-resolvers/create-crud-resolvers';
import GetMeResolver from 'src/modules/user/resolvers/get-me';

const CrudResolvers = createCrudResolvers('User', User, {
    create: { inputType: CreateUserInput, options: { one: { middleware: [isAuthRole] } } },
    update: { inputType: UpdateUserInput, options: { one: { middleware: [isAuthRole] } } },
    get: { options: { one: true, many: true } },
    delete: { options: { one: { middleware: [isAuthRole] } } },
});

export default [...CrudResolvers, GetMeResolver];
