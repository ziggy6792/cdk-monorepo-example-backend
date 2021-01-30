import User from 'src/domain-models/user';
import { CreateUserInput } from 'src/modules/user/create-user/create-user-input';
import isAuthRole from 'src/modules/middleware/is-auth-role';
import createCrudResolvers from 'src/modules/higher-order-resolvers/create-crud-resolvers';

const CrudResolvers = createCrudResolvers('User', User, {
    createOptions: { middleware: [isAuthRole], inputType: CreateUserInput },
    listOptions: { middleware: [isAuthRole] },
});

export default [...CrudResolvers];
