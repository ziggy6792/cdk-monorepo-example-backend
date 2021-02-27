import isAuthRoleMiddleware from 'src/middleware/is-auth-role-middleware';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import Round from 'src/domain/models/round';

const CrudResolvers = buildCrudResolvers('Round', Round, {
    crudProps: { get: { resolverProps: { one: true, many: true } } },
});

export default [...CrudResolvers];
