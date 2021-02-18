import isAuthRole from 'src/middleware/is-auth-role';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import Round from 'src/domain/models/round';

const CrudResolvers = buildCrudResolvers('Round', Round, {
    crudProps: { get: { resolverProps: { one: { middleware: [] }, many: { middleware: [] } } } },
});

export default [...CrudResolvers];
