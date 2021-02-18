import isAuthRole from 'src/middleware/is-auth-role';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import SeedSlot from 'src/domain/models/seed-slot';

const CrudResolvers = buildCrudResolvers('SeedSlot', SeedSlot, {
    crudProps: {
        get: { resolverProps: { one: { middleware: [] }, many: { middleware: [] } } },
    },
});

export default [...CrudResolvers];
