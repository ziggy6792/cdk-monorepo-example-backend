import User from 'src/domain-models/user';
import { CreateUserInput, UpdateUserInput } from 'src/modules/user/inputs/user-input';
import isAuthRole from 'src/modules/middleware/is-auth-role';
import createCrudResolvers from 'src/modules/higher-order-resolvers/create-crud-resolvers';

const CrudResolvers = createCrudResolvers('User', User, {
    createOptions: { middleware: [isAuthRole], inputType: CreateUserInput },
    updateOptions: { middleware: [isAuthRole], inputType: UpdateUserInput },
    listOptions: { middleware: [isAuthRole] },
    getOptions: { middleware: [isAuthRole] },
    deleteOptions: { middleware: [isAuthRole] },
});

export default [...CrudResolvers];
