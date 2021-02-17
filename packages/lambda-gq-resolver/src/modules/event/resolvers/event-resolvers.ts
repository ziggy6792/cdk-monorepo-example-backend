import Event from 'src/domain/models/event';
import isAuthRole from 'src/middleware/is-auth-role';
import createCrudResolvers from 'src/higher-order-resolvers/create-crud-resolvers';
import { CreateEventInput, UpdateEventInput } from 'src/modules/event/inputs';

const CrudResolvers = createCrudResolvers('Event', Event, {
    create: { inputType: CreateEventInput, resolvers: { one: true } },
    update: { inputType: UpdateEventInput, resolvers: { one: true } },
    get: { resolvers: { one: true, many: true } },
    delete: { resolvers: { one: true } },
});

export default [...CrudResolvers];
