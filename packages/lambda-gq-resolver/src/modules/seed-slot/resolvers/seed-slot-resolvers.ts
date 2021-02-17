import isAuthRole from 'src/middleware/is-auth-role';
import createCrudResolvers from 'src/higher-order-resolvers/create-crud-resolvers';
import SeedSlot from 'src/domain/models/seed-slot';

const CrudResolvers = createCrudResolvers('SeedSlot', SeedSlot, {
    get: { resolvers: { one: true, many: true } },
});

export default [...CrudResolvers];
