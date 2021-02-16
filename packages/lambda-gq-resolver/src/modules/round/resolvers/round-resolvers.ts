import isAuthRole from 'src/middleware/is-auth-role';
import createCrudResolvers from 'src/higher-order-resolvers/create-crud-resolvers';
import Round from 'src/domain/models/round';

const CrudResolvers = createCrudResolvers('Round', Round, {
    get: true,
});

export default [...CrudResolvers];
