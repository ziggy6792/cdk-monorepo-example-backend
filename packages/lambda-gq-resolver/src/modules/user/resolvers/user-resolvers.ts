import User from 'src/domain/models/user';
import { CreateUserInput, UpdateUserInput } from 'src/modules/user/inputs';
import isAuthRole from 'src/middleware/is-auth-role';
import createCrudResolvers from 'src/higher-order-resolvers/create-crud-resolvers';
import GetMeResolver from 'src/modules/user/resolvers/get-me';

const CrudResolvers = createCrudResolvers('User', User, {
    create: { middleware: [isAuthRole], inputType: CreateUserInput },
    update: { middleware: [isAuthRole], inputType: UpdateUserInput },
    list: { middleware: [isAuthRole] },
    get: { middleware: [isAuthRole] },
    delete: { middleware: [isAuthRole] },
});

export default [...CrudResolvers, GetMeResolver];
